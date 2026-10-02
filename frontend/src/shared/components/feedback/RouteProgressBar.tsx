import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import type { RoutePhase } from '@/app/router/useRoutePhase'
import { cn } from '@/shared/lib/cn'

interface RouteProgressBarProps {
  /**
   * Transition phase. The bar is a pure function of it: `active` sweeps the fill
   * out and holds it, `exiting` completes it and fades, `idle` unmounts.
   * Keeping the animation here rather than in component state is what lets the
   * whole thing stay effect-free.
   */
  phase: RoutePhase
}

/**
 * Slim progress bar for route transitions.
 *
 * Deliberately not a spinner: this is a 250–600 ms wait on a site that already
 * has a warm brand palette, and a full-screen loader would read as slower than
 * it is. The bar sits above the navbar, ignores pointer events, and announces
 * itself once through a polite live region rather than on every frame.
 */
export function RouteProgressBar({ phase }: RouteProgressBarProps) {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (phase === 'idle') return null

  const isExiting = phase === 'exiting'

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-accent-100"
      >
        <div
          className={cn(
            'h-full w-full origin-left bg-gradient-to-r from-accent-500 to-accent-600',
            isExiting
              ? 'route-progress-complete'
              : prefersReducedMotion
                ? 'opacity-70'
                : 'route-progress-enter',
          )}
        />
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        Loading page
      </span>
    </>
  )
}