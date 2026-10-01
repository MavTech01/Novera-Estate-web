import { cn } from '@/shared/lib/cn'

interface ProjectResultsHeaderProps {
  /** Number of developments currently matching the filters. */
  total: number
  isLoading?: boolean
  className?: string
}

/**
 * The count above the grid: "12 developments found".
 *
 * The mobile filter trigger deliberately does not live here — it belongs to
 * `ProjectMobileFilterDrawer`, which owns the disclosure state, so there is
 * only ever one Filters button on the page.
 */
export function ProjectResultsHeader({ total, isLoading = false, className }: ProjectResultsHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4', className)}>
      <p className="text-sm text-ink-500" aria-live="polite">
        <span className="font-semibold text-ink-900">{isLoading ? '—' : total.toLocaleString('en-NG')}</span>{' '}
        {total === 1 ? 'development' : 'developments'} found
      </p>
    </div>
  )
}