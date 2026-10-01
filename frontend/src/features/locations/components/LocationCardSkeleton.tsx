import { Skeleton } from '@/shared/components/ui/Skeleton'
import { cn } from '@/shared/lib/cn'

interface LocationCardSkeletonProps {
  className?: string
  /** Dims the block while a background refresh is in flight. */
  isRefreshing?: boolean
}

/**
 * Placeholder that mirrors `LocationCard` — media, region pill, name, summary,
 * both counts and the button — so the grid does not reflow when results arrive.
 */
export function LocationCardSkeleton({ className, isRefreshing = false }: LocationCardSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading location"
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm',
        isRefreshing && 'opacity-60',
        className,
      )}
    >
      <Skeleton className="aspect-[3/2] w-full rounded-none" />

      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-6 w-2/5" />

        <Skeleton className="mt-3 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-4/5" />

        <div className="mt-5 flex items-center gap-5 border-t border-sand-200 pt-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>

        <Skeleton className="mt-5 h-11 w-36 rounded-md" />
      </div>
    </div>
  )
}

interface LocationGridSkeletonProps {
  count?: number
  className?: string
}

/** Grid of card placeholders used for the first (unhydrated) load. */
export function LocationGridSkeleton({ count = 6, className }: LocationGridSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7', className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <LocationCardSkeleton key={index} />
      ))}
    </div>
  )
}

interface LocationsPageSkeletonProps {
  count?: number
  className?: string
}

/**
 * The page-level loading state.
 *
 * Only the grid is faked: the hero and the surrounding sections are static
 * layout that renders identically before and after loading, so faking them
 * would add shimmer where there is nothing to wait for. This covers the one
 * region whose content genuinely arrives asynchronously.
 */
export function LocationsPageSkeleton({ count = 6, className }: LocationsPageSkeletonProps) {
  return <LocationGridSkeleton count={count} className={className} />
}
