import { useLayoutEffect } from 'react'

import { applyScroll, locationKey, takeCommittedScrollIntent } from '@/shared/lib/location'
import { useRouteTransition } from './useRouteTransition'

/**
 * The one place in the application that moves the window on a route change.
 *
 * Why it lives here rather than in the transition store or in a layout component:
 *
 *  - **Not in the store.** `commit()` runs before React has re-rendered, so a
 *    scroll issued from there moves the *outgoing* page — the visitor sees the
 *    page they just left slide to the top, which is the bug this fixes.
 *  - **Not in a layout component.** That would work, but the transition store is
 *    what decides *whether* to scroll (top / restore / anchor / stay put), and it
 *    has to hand that decision to the render phase. This hook is the single seam
 *    between the two.
 *  - **Not per page.** Pages never scroll themselves, so nothing has to be
 *    remembered when a new route is added.
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
 * The intent is taken (not merely read) and keyed by location, so the effect is
 * idempotent: a re-render, a same-key commit, or StrictMode's double-invoked
 * effect finds nothing to do rather than scrolling twice.
 */
export function useScrollRestoration(): void {
  const { location } = useRouteTransition()
  const key = locationKey(location)

  useLayoutEffect(() => {
    applyScroll(location, takeCommittedScrollIntent(key))
  }, [key, location])
}
