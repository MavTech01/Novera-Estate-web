import { cn } from '@/shared/lib/cn'
import type { PropertySort } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'
import { PropertySort as PropertySortField } from './PropertySort'

interface PropertyResultsHeaderProps {
  /** Total matching listings — generated from the data, never hard-coded. */
  total: number
  sort: PropertySort
  onSortChange: (sort: PropertySort) => void
  /** Only rendered while loading or refreshing an existing result set. */
  isLoading?: boolean
  /** Whether user has active filters. If false, count text is hidden. */
  isFiltered?: boolean
  className?: string
}

/**
 * Row above the grid: result count on the left, sort on the right.
 */
export function PropertyResultsHeader({
  total,
  sort,
  onSortChange,
  isLoading = false,
  isFiltered = true,
  className,
}: PropertyResultsHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        {isFiltered && (
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
        )}
      </div>

      <div className="flex w-full items-end gap-3 sm:w-auto sm:ml-auto">
        <PropertySortField
          value={sort}
          onChange={onSortChange}
          id="properties-sort"
          className="min-w-[13rem] flex-1 sm:flex-none"
        />
      </div>
    </div>
  )
}
