import { Button } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'

interface LocationErrorStateProps {
  message?: string
  onRetry: () => void
  className?: string
}

/**
 * Failure state for the locations request.
 *
 * The copy stays generic on purpose: once the Express API is connected this is
 * the screen shown for network failures and 5xx responses, so it must not
 * promise anything about a specific area.
 */
export function LocationErrorState({
  message = "We couldn't load our locations. Please try again.",
  onRetry,
  className,
}: LocationErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-sand-200 bg-white px-6 py-16 text-center shadow-sm',
        className,
      )}
    >
      <span className="flex size-16 items-center justify-center rounded-pill bg-tint-50 text-accent-600">
        <Icon name="triangle-alert" className="size-7" strokeWidth={1.75} />
      </span>

      <h3 className="mt-5 font-display text-xl text-ink-900">We couldn't load our locations</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">{message}</p>

      <Button onClick={onRetry} className="mt-6">
        <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
        Try Again
      </Button>
    </div>
  )
}
