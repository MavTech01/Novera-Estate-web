import type { ActiveFilter } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyActiveFiltersProps {
  filters: ActiveFilter[]
  onRemove: (filter: ActiveFilter) => void
  onClearAll: () => void
  className?: string
}

/**
 * Removable summary of everything currently applied.
 * The most common source of "why am I seeing this?" confusion, so each chip
 * clears exactly one facet.
 */
export function PropertyActiveFilters({
  filters,
  onRemove,
  onClearAll,
  className,
}: PropertyActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <div className={className}>
      <h2 className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">Active filters</h2>

      <ul className="mt-3 flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <li key={filter.id}>
            <button
              type="button"
              onClick={() => onRemove(filter)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border border-accent-200 bg-tint-50 py-1 pl-3 pr-2 text-xs font-semibold text-accent-700 transition-colors duration-200 hover:border-accent-400 hover:bg-tint-100"
            >
              <span className="max-w-[14rem] truncate">{filter.label}</span>
              <span className="inline-flex size-5 items-center justify-center rounded-pill bg-white/70">
                <Icon name="close" className="size-3" strokeWidth={2.5} />
                <span className="sr-only">Remove {filter.label} filter</span>
              </span>
            </button>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex min-h-9 items-center rounded-pill px-3 text-xs font-semibold text-ink-500 underline underline-offset-4 transition-colors duration-200 hover:text-accent-700"
          >
            Clear all
          </button>
        </li>
      </ul>
    </div>
  )
}
