import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import type { ActiveLocationFilter } from '@/features/locations/types/locationTypes'

interface LocationActiveFiltersProps {
  filters: ActiveLocationFilter[]
  /** Clears one chip, or everything when no field is passed. */
  onRemove: (field?: ActiveLocationFilter['field']) => void
  onClearAll: () => void
  className?: string
}

/**
 * Removable chips describing what is currently applied.
 *
 * Both the search term and the category are independently dismissable, so a
 * visitor who typed a term inside a category can widen it without losing what
 * they typed. Renders nothing at all when no filters are active, rather than an
 * empty bar.
 */
export function LocationActiveFilters({ filters, onRemove, onClearAll, className }: LocationActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      <span className="text-sm text-ink-500">Active filters:</span>

      <ul className="flex flex-wrap items-center gap-2.5">
        {filters.map((filter) => (
          <li key={filter.id}>
            <button
              type="button"
              onClick={() => onRemove(filter.field)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border border-accent-200 bg-tint-50 px-3 text-sm font-semibold text-accent-700 transition-colors duration-200 hover:border-accent-400 hover:bg-tint-100"
            >
              {filter.label}
              <Icon name="close" className="size-3.5" strokeWidth={2.2} />
              <span className="sr-only">Remove filter</span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:text-accent-700"
      >
        <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
        Clear all
      </button>
    </div>
  )
}
