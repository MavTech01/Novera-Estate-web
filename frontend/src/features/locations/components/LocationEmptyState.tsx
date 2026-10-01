import { ButtonLink, Button } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'

interface LocationEmptyStateProps {
  /** Clears the search text and resets the category. */
  onReset: () => void
  /** Optional secondary action, e.g. "Browse all properties". */
  action?: { label: string; href: string }
  className?: string
}

/**
 * Shown when the current search and category match nothing.
 *
 * Always offers a way out — clear the search, or go somewhere useful instead.
 * A dead end here would be the worst outcome for the page, since a visitor who
 * mistyped an area name has still not seen the rest of the catalogue.
 */
export function LocationEmptyState({ onReset, action, className }: LocationEmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-sand-300 bg-tint-50 px-6 py-16 text-center',
        className,
      )}
    >
      <span className="flex size-16 items-center justify-center rounded-pill bg-white text-accent-500 shadow-sm">
        <Icon name="search" className="size-7" strokeWidth={1.75} />
      </span>

      <h3 className="mt-5 font-display text-xl text-ink-900">No Locations Found</h3>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        Try adjusting your search or choosing a different category.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onReset} withArrow={false}>
          <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
          Clear Search
        </Button>

        {action && (
          <ButtonLink href={action.href} variant="outline" withArrow>
            {action.label}
          </ButtonLink>
        )}
      </div>
    </div>
  )
}
