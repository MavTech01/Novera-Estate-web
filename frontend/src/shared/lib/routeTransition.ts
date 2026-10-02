import {
  consumeScrollIntent,
  getLocationSnapshot,
  locationKey,
  parseLocation,
  recordCommittedScrollIntent,
  rememberScrollPosition,
  subscribeToLocation,
  type LocationChange,
  type ParsedLocation,
} from './location'
import { findRoute, loadRoute } from './routeManifest'

/**
 * Route transition store.
 *
 * The site never swaps a page out from under the visitor. A navigation marks the
 * destination as *pending*, loads what that destination needs, and only then
 * makes it the committed location. Everything React renders keys off the
 * committed location, so the page on screen and its URL always agree — the
 * outgoing page does not even refetch while the bar is up.
 *
 * The visual phases exist so the progress bar can be a pure function of state:
 * `entering` grows it, `loading` holds it, `exiting` completes and fades it.
 * Doing that here rather than in component state keeps the animation free of
 * effects.
 */

export type RoutePhase = 'idle' | 'entering' | 'loading' | 'exiting'

export interface RouteTransitionState {
  /** The location currently rendered. */
  location: ParsedLocation
  /** The location being loaded, or `null` when nothing is in flight. */
  pending: ParsedLocation | null
  /** Drives the progress bar. */
  phase: RoutePhase
  /** True while a navigation is being prepared. */
  isPending: boolean
  /** True until the first route's data has settled. */
  isBooting: boolean
}

/**
 * A loader that appears for less than a frame reads as a glitch, so the bar is
 * held on screen for at least this long. It is a floor, never a delay: a slow
 * request still shows for as long as it takes.
 */
const MIN_VISIBLE_MS = 250

/** A request that never settles must not trap the visitor on the old page. */
const MAX_WAIT_MS = 4000

/** How long the completed bar takes to fade out. */
const EXIT_MS = 220

const MAIN_CONTENT_ID = 'main-content'

let committed: ParsedLocation = parseLocation(getLocationSnapshot())
let pending: ParsedLocation | null = null
let phase: RoutePhase = 'idle'
let isBooting = true

/** Bumped for every navigation so a superseded load can discard its result. */
let generation = 0

let state: RouteTransitionState = buildState()
const listeners = new Set<() => void>()
let stopLocation: (() => void) | null = null
let exitTimer: ReturnType<typeof setTimeout> | null = null
let bootResolvers: (() => void)[] = []

function buildState(): RouteTransitionState {
  return {
    location: committed,
    pending,
    phase,
    isPending: pending !== null,
    isBooting,
  }
}

function publish(): void {
  state = buildState()
  for (const listener of listeners) listener()
}

function clearExitTimer(): void {
  if (exitTimer === null) return
  clearTimeout(exitTimer)
  exitTimer = null
}

/** The pattern that decides whether two locations are "the same page". */
function routeKeyOf(location: ParsedLocation): string {
  const match = findRoute(location.path)
  return match ? match.definition.pattern : `path:${location.path}`
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

function beginTransition(next: ParsedLocation): void {
  clearExitTimer()

  generation += 1
  const token = generation
  const startedAt = Date.now()

  pending = next
  phase = 'entering'
  publish()

  // A second frame moves the bar from its entry animation into its held state.
  setTimeout(() => {
    if (token === generation && phase === 'entering') phase = 'loading'
    if (token === generation) publish()
  }, 240)

  void runTransition(next, token, startedAt)
}

async function runTransition(next: ParsedLocation, token: number, startedAt: number): Promise<void> {
  try {
    await Promise.race([loadRoute(next), delay(MAX_WAIT_MS)])
  } catch {
    // A failed preload must never block navigation: the page renders its own
    // error state, which is more useful than a loader that never resolves.
  }

  const elapsed = Date.now() - startedAt
  if (elapsed < MIN_VISIBLE_MS) await delay(MIN_VISIBLE_MS - elapsed)

  if (token !== generation) return

  commit(next)
}

/**
 * Makes `next` the rendered location and hands the scroll to the layout phase.
 *
 * The scroll itself is *not* done here. Committing only changes what React
 * renders; the window is moved afterwards by `useScrollRestoration`, in a layout
 * effect, so the new page's DOM is already in place. Scrolling from inside this
 * store would move the page the visitor is still looking at.
 */
function commit(next: ParsedLocation): void {
  rememberScrollPosition(locationKey(committed))

  const intent = consumeScrollIntent()
  recordCommittedScrollIntent(next, intent)

  committed = next
  pending = null
  phase = 'exiting'
  publish()

  focusRouteRegion(intent)

  exitTimer = setTimeout(() => {
    exitTimer = null
    // Only the navigation that finished may clear the bar.
    if (phase === 'exiting') {
      phase = 'idle'
      publish()
    }
  }, EXIT_MS)
}

/** Discards an in-flight navigation and stays where we are. */
function cancelPending(): void {
  generation += 1
  clearExitTimer()

  pending = null
  phase = 'idle'

  // The recorded intent belonged to the cancelled navigation.
  consumeScrollIntent()
  publish()
}

/**
 * Moves focus into the new page so keyboard and screen-reader users are not left
 * on a link in the page that has just been replaced.
 */
function focusRouteRegion(intent: ReturnType<typeof consumeScrollIntent>): void {
  // An in-page move has its own target; pulling focus out of it would be rude.
  if (intent.type === 'hash' || intent.type === 'none') return
  if (typeof document === 'undefined') return

  window.requestAnimationFrame(() => {
    const main = document.getElementById(MAIN_CONTENT_ID)
    // `preventScroll` leaves the scroll handling above in charge.
    main?.focus({ preventScroll: true })
  })
}

function handleLocationChange(snapshot: string, change: LocationChange): void {
  const next = parseLocation(snapshot)

  // Query-only updates come from the page on screen keeping its URL in sync.
  // They are never a navigation, and must not interrupt one.
  if (change === 'replace') {
    if (!pending) {
      committed = next
      publish()
    }
    return
  }

  if (pending) {
    // Re-emitted destination (a redirect or a corrected query) — keep waiting.
    if (next.path === pending.path) return

    // Back/forward to the page already on screen cancels the navigation.
    if (change === 'popstate' && next.path === committed.path) {
      cancelPending()
      return
    }

    beginTransition(next)
    return
  }

  // Same page, different query or hash (filters, pagination, in-page anchors):
  // no transition, just update in place.
  if (routeKeyOf(next) === routeKeyOf(committed)) {
    commit(next)
    return
  }

  beginTransition(next)
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                  */
/* -------------------------------------------------------------------------- */

export function subscribeToRouteTransition(listener: () => void): () => void {
  listeners.add(listener)

  if (!stopLocation) {
    stopLocation = subscribeToLocation(handleLocationChange)
    // Resync in case the URL moved while nothing was listening (React remounts
    // its effects in StrictMode, so this is the normal path, not an edge case).
    handleLocationChange(getLocationSnapshot(), 'navigate')
  }

  return () => {
    listeners.delete(listener)

    if (listeners.size === 0 && stopLocation) {
      stopLocation()
      stopLocation = null
    }
  }
}

export function getRouteTransitionSnapshot(): RouteTransitionState {
  return state
}

/**
 * Loads the first route's data so a deep link paints its content rather than a
 * skeleton. Idempotent, and safe to call from an effect that runs twice.
 */
export function ensureBootLoad(): void {
  if (!isBooting || pending) return

  const target = committed

  void Promise.race([loadRoute(target), delay(MAX_WAIT_MS)])
    .catch(() => undefined)
    .then(() => {
      isBooting = false
      publish()

      const resolvers = bootResolvers
      bootResolvers = []
      for (const resolve of resolvers) resolve()
    })
}

/** Resolves once the first route is ready, for the pre-React boot screen. */
export function whenBootReady(): Promise<void> {
  if (!isBooting) return Promise.resolve()

  return new Promise((resolve) => {
    bootResolvers.push(resolve)
  })
}