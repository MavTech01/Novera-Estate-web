import type { RoutePhase } from '@/app/router/useRoutePhase'

interface RouteProgressBarProps {
  phase: RoutePhase
}

export function RouteProgressBar({ phase }: RouteProgressBarProps) {
  if (phase === 'idle') return null

  const isExiting = phase === 'exiting'

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 bg-accent-100/60"
      >
        <div
          className={`h-full w-full origin-left bg-gradient-to-r from-accent-500 to-accent-600 ${
            isExiting ? 'route-progress-complete' : 'route-progress-enter'
          }`}
        />
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        Loading page
      </span>
    </>
  )
}
