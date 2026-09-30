import { useCallback, useMemo, useSyncExternalStore } from 'react'

import { isInternalHref, normalisePath, splitHref } from '../lib/router'

/**
 * Minimal history router.
 *
 * A single module-level store publishes `pathname + search` to every
 * subscriber, so `<Link />` components anywhere in the tree can navigate
 * without prop drilling. `popstate` is wired once, giving native back/forward
 * support for free.
 *
 * This is the seam that later becomes React Router: only `navigate`, `useRouter`
 * and `<Link />` need to change.
 */

type Listener = () => void

const listeners = new Set<Listener>()

function getSnapshot(): string {
  if (typeof window === 'undefined') return '/'
  return `${window.location.pathname}${window.location.search}`
}

function emit(): void {
  for (const listener of listeners) listener()
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)

  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('popstate', emit)
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('popstate', emit)
    }
  }
}

export interface NavigateOptions {
  /** Replaces the current history entry instead of pushing a new one. */
  replace?: boolean
  /** Set to false to leave the scroll position untouched. */
  scroll?: boolean
}

function scrollToHash(hash: string): void {
  if (!hash) {
    window.scrollTo({ top: 0, behavior: 'auto' })
    return
  }

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
 * Programmatic navigation. External URLs fall through to the browser, and
 * same-page hash links (`/#about`) scroll instead of re-rendering.
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
    if (scroll) scrollToHash(hash)
    return
  }

  if (replace) window.history.replaceState(null, '', nextUrl)
  else window.history.pushState(null, '', nextUrl)

  emit()

  if (scroll) {
    // The outgoing page must unmount before an anchor on the incoming page can
    // be found, so hash scrolling is deferred past the current paint.
    if (hash) window.requestAnimationFrame(() => scrollToHash(hash))
    else window.scrollTo({ top: 0, behavior: 'auto' })
  }
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

  window.history.replaceState(null, '', nextUrl)
  emit()
}

export interface RouterState {
  /** Normalised pathname, e.g. `/properties/luxury-4-bedroom-duplex`. */
  path: string
  /** Parsed query string of the current URL. */
  query: URLSearchParams
}

export function useRouter(): RouterState {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return useMemo(() => {
    const searchIndex = snapshot.indexOf('?')
    const path = searchIndex === -1 ? snapshot : snapshot.slice(0, searchIndex)
    const search = searchIndex === -1 ? '' : snapshot.slice(searchIndex + 1)

    return { path: normalisePath(path), query: new URLSearchParams(search) }
  }, [snapshot])
}

/** Convenience wrapper exposing only the pathname. */
export function usePathname(): string {
  const { path } = useRouter()
  return path
}

export function useNavigate(): (to: string, options?: NavigateOptions) => void {
  return useCallback((to: string, options?: NavigateOptions) => navigate(to, options), [])
}
