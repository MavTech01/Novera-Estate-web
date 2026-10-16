import { cn } from '@/shared/lib/cn'
import type { PropertySort } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'
import { PropertySort as PropertySortField } from './PropertySort'

interface PropertyResultsHeaderProps {
  /** Total matching listings — generated from the data, never hard-coded. */
  total: number
  sort: PropertySort
  onSortChange: (sort: PropertySort) => void
  onOpenFilters: () => void
  activeCount: number
  /** Only rendered while loading or refreshing an existing result set. */
  isLoading?: boolean
  className?: string
}

/**
 * Row above the grid: result count on the left, sort on the right, and the
 * drawer trigger that replaces the sidebar below the `lg` breakpoint.
 */
export function PropertyResultsHeader({
  total,
  sort,
  onSortChange,
  onOpenFilters,
  activeCount,
  isLoading = false,
  className,
}: PropertyResultsHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <p aria-live="polite" className="font-display text-xl text-ink-900 sm:text-2xl">
          {isLoading ? (
            <span className="inline-flex items-center gap-2 text-ink-500">
              <Icon name="search" className="size-5 text-accent-500" strokeWidth={2} />
              Updating results…
            </span>
          ) : (
            <>
              {total.toLocaleString('en-NG')}{' '}
              <span className="text-ink-500">
                {total === 1 ? 'Property' : 'Properties'} Found
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex w-full items-end gap-3 sm:w-auto">
        <PropertySortField
          value={sort}
          onChange={onSortChange}
          id="properties-sort"
          className="min-w-[13rem] flex-1 sm:flex-none"
        />

        <button
          type="button"
          onClick={onOpenFilters}
          aria-haspopup="dialog"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-sand-200 bg-white px-4 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700 lg:hidden"
        >
          <Icon name="sliders-horizontal" className="size-4 text-accent-600" strokeWidth={2} />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-pill bg-accent-600 px-1.5 py-0.5 text-[0.6875rem] font-bold leading-none text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
