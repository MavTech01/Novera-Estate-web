import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * What should happen to the scroll position once a new route has committed.
 */
const MAIN_CONTENT_ID = 'main-content'

/**
 * Scroll offsets keyed by URL, so back and forward return the visitor to where
 * they were rather than dumping them at the top of a page they were halfway
 * down. Module scope so it survives the shell remounting.
 */
const scrollPositions = new Map<string, number>()

/**
 * Where the visitor is on the page currently being read, and which URL that is.
 *
 * This is tracked from a scroll listener rather than read from `window.scrollY`
 * at commit time, which is what a naive implementation does and is wrong for
 * back/forward. On a POP the browser begins restoring the *incoming* entry's
 * offset as part of handling the history traversal, so by the time a layout
 * effect runs to file away the page being left, the window has already been
 * moved. Sampling there records the new page's position against the old page's
 * URL, and the next forward then lands the visitor somewhere they never were.
 *
 * A listener sees the offset while the visitor is still on the page it belongs
 * to, so the value is right regardless of how the navigation was triggered.
 */
let restingKey: string | null = null
let restingScrollY = 0
let trackingRestingOffset = false

function trackRestingOffset(): void {
  if (trackingRestingOffset) return
  trackingRestingOffset = true
  window.addEventListener(
    'scroll',
    () => {
      restingScrollY = window.scrollY
    },
    { passive: true },
  )
}

/**
 * Moves the window to `top` as a single frame, never an animation.
 *
 * This is the whole reason the route reset used to look broken. `html` carries
 * `scroll-behavior: smooth` so in-page anchors glide, and per the CSSOM spec
 * `behavior: 'auto'` *inherits the element's computed value* — it does not mean
 * "instant". So a reset written as `scrollTo({ top: 0, behavior: 'auto' })` was
 * a smooth animation: the outgoing page visibly slid 1200 → 0, and the incoming
 * page's entrance animations ran while it slid.
 *
 * `'instant'` is the only value that overrides the CSS. Anchors keep their
 * intentional smooth scroll below — they are genuine same-page navigation — while
 * a route change becomes the single-frame jump it was always meant to be.
 */
function jumpTo(top: number): void {
  window.scrollTo({ top, behavior: 'instant' })
}

/**
 * Scrolls to an in-page anchor, retrying briefly.
 *
 * A cross-route hash link can be painted a frame or two after the click, so it is
 * retried for a few frames rather than being abandoned as a missing element.
 */
function scrollToHash(hash: string): void {
  const id = decodeURIComponent(hash.slice(1))
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
 * Settles the scroll position for the committed route, before paint.
 *
 * A `useLayoutEffect` rather than `useEffect` is the whole timing story. It runs
 * after React commits the new page's DOM and *before* the browser paints, which
 * gives exactly the intended order:
 *
 *     outgoing page stays put  →  new page committed  →  scroll applied  →  paint
 *
 * The incoming page is therefore never painted at the outgoing page's offset, and
 * the outgoing page never visibly moves. Because it lands before paint, the new
 * page's own entrance animations — the hero's staggered CSS reveal and every
 * `Reveal`'s IntersectionObserver — are evaluated against the correct scroll
 * position, start once, and are unaffected by where the visitor was on the page
 * they came from.
 *
 * The router's navigation type already encodes which of the four cases this is,
 * so nothing has to be recorded at click time:
 *
 *   PUSH    — a different page:        start at the top
 *   REPLACE — the page rewrote its own query (filters, sort, page): stay put
 *   POP     — back/forward:             restore the remembered offset
 *   a hash  — an in-page anchor:        glide to the element
 */
export function RouteScrollReset() {
  const { pathname, search, hash } = useLocation()
  const navigationType = useNavigationType()
  const key = `${pathname}${search}`

  useLayoutEffect(() => {
    trackRestingOffset()

    // File away the page being left, using the offset the visitor was last seen
    // at on it rather than wherever the window happens to be now.
    if (restingKey !== null && restingKey !== key) {
      scrollPositions.set(restingKey, restingScrollY)
    }

    if (hash) scrollToHash(hash)
    else if (navigationType === 'REPLACE') {
      // Filters, sort and pagination rewrite the query in place: the visitor
      // keeps reading, so the offset is remembered against the new URL too.
      scrollPositions.set(key, restingScrollY)
    } else if (navigationType === 'POP') jumpTo(scrollPositions.get(key) ?? 0)
    else jumpTo(0)

    restingKey = key
    restingScrollY = window.scrollY
  }, [key, hash, navigationType])

  return null
}

/**
 * Moves focus into the new page so keyboard and screen-reader users are not left
 * on a link in the page that has just been replaced.
 *
 * Skipped for an in-page move, which has its own target, and for a query-only
 * update, where the page the visitor is reading is still the same one.
 */
export function RouteFocus() {
  const { pathname, search, hash } = useLocation()
  const navigationType = useNavigationType()
  const key = `${pathname}${search}`

  useLayoutEffect(() => {
    if (hash || navigationType === 'REPLACE') return

    // `preventScroll` leaves the scroll handling above in charge.
    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true })
  }, [key, hash, navigationType])

  return null
}
