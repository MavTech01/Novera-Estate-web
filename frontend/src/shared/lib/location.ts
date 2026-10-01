import { isInternalHref, normalisePath, splitHref } from './router'

/**
 * Browser location store.
 *
 * Owns everything about "where the visitor is": the URL, the navigation API
 * entry points, and the scroll behaviour that goes with a navigation. It holds
 * no React state and renders nothing, which keeps it usable from the
 * transition layer as well as from hooks.
 *
 * One rule is worth stating, because the transition layer depends on it:
 * **this module never scrolls.** `navigate()` only records an *intent* and lets
 * listeners decide when to act on it. A route transition swaps the page some
 * time after the click, so scrolling here would move the outgoing page out from
 * under the visitor.
 */

/** What should happen to the scroll position once the new page is committed. */
export type ScrollIntent =
  /** A new page was pushed — start at the top. */
  | { type: 'top' }
  /** Same page, new query (filters, sorting, pagination) — stay exactly where we are. */
  | { type: 'none' }
  /** An on-page anchor — scroll to that element once it exists. */
  | { type: 'hash'; hash: string }
  /** Back/forward — put the visitor back where they were. */
  | { type: 'restore' }

export interface ParsedLocation {
  path: string
  query: URLSearchParams
}

export interface NavigateOptions {
  /** Replaces the current history entry instead of pushing a new one. */
  replace?: boolean
  /** Set to false to leave the scroll position untouched. */
  scroll?: boolean
}

/**
 * Why the location changed.
 *
 * The transition layer needs this: `replace` fires on every keystroke in the
 * filter bar as the URL is kept in sync with the grid, and that must never be
 * mistaken for a navigation. `popstate` is back/forward, which is.
 */
export type LocationChange = 'navigate' | 'replace' | 'popstate'

type Listener = (snapshot: string, change: LocationChange) => void

const listeners = new Set<Listener>()

/**
 * Scroll offsets keyed by URL. This is an approximation of per-history-entry
 * restoration (the browser's own model) — good enough to stop back/forward from
 * dumping the visitor at the top of a page they were halfway down.
 */
const scrollPositions = new Map<string, number>()

let scrollIntent: ScrollIntent = { type: 'top' }

/** Canonical key for a location, used for cache and scroll-position lookups. */
export function locationKey(location: ParsedLocation): string {
  const search = location.query.toString()
  return `${location.path}${search ? `?${search}` : ''}`
}

export function getLocationSnapshot(): string {
  if (typeof window === 'undefined') return '/'
  return `${window.location.pathname}${window.location.search}`
}

export function parseLocation(snapshot: string): ParsedLocation {
  const searchIndex = snapshot.indexOf('?')
  const rawPath = searchIndex === -1 ? snapshot : snapshot.slice(0, searchIndex)
  const search = searchIndex === -1 ? '' : snapshot.slice(searchIndex + 1)

  return { path: normalisePath(rawPath), query: new URLSearchParams(search) }
}

function emit(change: LocationChange): void {
  const snapshot = getLocationSnapshot()
  for (const listener of listeners) listener(snapshot, change)
}

function handlePopState(): void {
  scrollIntent = { type: 'restore' }
  emit('popstate')
}

/**
 * Subscribes to every location change — link clicks, programmatic navigation
 * and back/forward alike — so callers have one place to react to.
 */
export function subscribeToLocation(listener: Listener): () => void {
  listeners.add(listener)

  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('popstate', handlePopState)
  }

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('popstate', handlePopState)
    }
  }
}

/**
 * Programmatic navigation. External URLs fall through to the browser, and a
 * link to the URL already shown just scrolls rather than re-rendering.
 */
export function navigate(to: string, { replace = false, scroll = true }: NavigateOptions = {}): void {
  if (typeof window === 'undefined') return

  if (!isInternalHref(to)) {
    window.location.assign(to)
    return
  }

  const { path, search, hash } = splitHref(to)
  const nextUrl = `${normalisePath(path) || '/'}${search}${hash}`

  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (current === nextUrl) {
    // Nothing to transition to; honour the scroll request immediately.
    if (scroll && hash) scrollToHash(hash)
    return
  }

  scrollIntent = scroll ? (hash ? { type: 'hash', hash } : { type: 'top' }) : { type: 'none' }

  if (replace) window.history.replaceState(null, '', nextUrl)
  else window.history.pushState(null, '', nextUrl)

  emit('navigate')
}

/**
 * Replaces only the query string of the current URL. Used to keep the filter
 * state shareable without flooding the browser history with every keystroke.
 */
export function replaceSearchParams(params: URLSearchParams): void {
  if (typeof window === 'undefined') return

  const search = params.toString()
  const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}`
  const current = `${window.location.pathname}${window.location.search}`

  if (current === nextUrl) return

  // Filters update the grid in place: no scroll, and never a page transition.
  scrollIntent = { type: 'none' }

  window.history.replaceState(null, '', nextUrl)
  emit('replace')
}

/** Reads and resets the recorded intent, so it is only ever applied once. */
export function consumeScrollIntent(): ScrollIntent {
  const intent = scrollIntent
  scrollIntent = { type: 'top' }
  return intent
}

export function rememberScrollPosition(key: string): void {
  if (typeof window === 'undefined') return
  scrollPositions.set(key, window.scrollY)
}

export function readScrollPosition(key: string): number | undefined {
  return scrollPositions.get(key)
}

function scrollToHash(hash: string): void {
  const id = decodeURIComponent(hash.slice(1))

  // A cross-route hash link can be painted one or two frames after the click, so
  // retry briefly before giving up rather than scrolling to a missing element.
  let attempts = 0
  const tryScroll = () => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    attempts += 1
    if (attempts < 10) window.requestAnimationFrame(tryScroll)
  }

  tryScroll()
}

/**
 * Applies a navigation's scroll behaviour. Called once the new page is on
 * screen, and deferred a frame so the freshly committed layout can be measured.
 */
export function applyScroll(location: ParsedLocation, intent: ScrollIntent): void {
  if (typeof window === 'undefined' || intent.type === 'none') return

  const run = () => {
    if (intent.type === 'hash') {
      scrollToHash(intent.hash)
      return
    }

    if (intent.type === 'restore') {
      const offset = readScrollPosition(locationKey(location))
      window.scrollTo({ top: offset ?? 0, behavior: 'auto' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  window.requestAnimationFrame(run)
}