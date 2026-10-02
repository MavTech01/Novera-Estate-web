import { useEffect, useState } from 'react'

/**
 * The visual phases of a route transition.
 *
 * `active` sweeps the bar out and holds it, `exiting` completes it and fades,
 * `idle` unmounts it.
 *
 * There is deliberately no separate "entering" phase. The sweep is a one-shot CSS
 * animation that ends in a held state, so an "entering → loading" step would be a
 * distinction the pixels cannot show.
 */
export type RoutePhase = 'idle' | 'active' | 'exiting'

/**
 * How long the completed bar is left on screen to fade.
 *
 * This is also the bar's minimum visible life, which is why there is no separate
 * "hold it open for N ms" timer. A page change that resolves instantly would
 * otherwise show a bar for a single frame, which reads as a glitch rather than as
 * feedback; the fade already keeps it up long enough to be seen.
 *
 * It matches the `route-progress-complete` animation in `components.css`, so the
 * element is removed exactly as that animation ends.
 */
const EXIT_MS = 220

/**
 * Derives the bar's phase from "is a *different page* being swapped in".
 *
 * Takes the decision as an argument rather than reading the router itself,
 * because the distinction matters: refining a filter is a real navigation, but
 * it keeps the visitor on the page they are reading. React Router reports both
 * the same way, so the bar has to be told which one it is — otherwise every
 * keystroke in a filter would flash a page-load animation.
 */
export function useRoutePhase(isPageChange: boolean): RoutePhase {
  // `isPageChange` already says the bar is up, so only the fade has to be
  // remembered — it is the part that outlives the navigation.
  const [isFading, setIsFading] = useState(false)
  const [wasChanging, setWasChanging] = useState(isPageChange)

  // The end of a page change is what starts the fade, and it is known the moment
  // the flag flips, in the very render that reports it. Deciding here rather than
  // in an effect is what keeps the bar from unmounting for a frame on the way out
  // — an effect would render `idle` once, then flip to `exiting`, restarting the
  // fade animation and flashing the bar.
  if (wasChanging !== isPageChange) {
    setWasChanging(isPageChange)
    if (!isPageChange) setIsFading(true)
  }

  useEffect(() => {
    if (isPageChange || !isFading) return

    const done = setTimeout(() => setIsFading(false), EXIT_MS)
    return () => clearTimeout(done)
  }, [isPageChange, isFading])

  if (isPageChange) return 'active'
  return isFading ? 'exiting' : 'idle'
}
