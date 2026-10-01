import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyErrorStateProps {
  message?: string
  onRetry: () => void
  className?: string
}

/**
 * Failure state for the listing request.
 *
 * The copy stays generic on purpose: once the Express API is connected this is
 * the screen shown for network failures and 5xx responses.
 */
export function PropertyErrorState({
  message = "We couldn't load the properties right now. Please try again.",
  onRetry,
  className,
}: PropertyErrorStateProps) {
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

      <h3 className="mt-5 font-display text-xl text-ink-900">Something went wrong</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800"
      >
        <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
        Try Again
      </button>
    </div>
  )
}
