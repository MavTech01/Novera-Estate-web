import { cn } from '@/shared/lib/cn'
import { Skeleton } from '@/shared/components/ui/Skeleton'

interface PropertyCardSkeletonProps {
  className?: string
  /** Dims the block while a background refresh is in flight. */
  isRefreshing?: boolean
}

/**
 * Placeholder that mirrors `PropertyCard` exactly — media, title, location,
 * price and specs — so the grid does not reflow when results arrive.
 */
export function PropertyCardSkeleton({ className, isRefreshing = false }: PropertyCardSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading property"
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm',
        isRefreshing && 'opacity-60',
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      <div className="flex flex-1 flex-col p-5 pt-8">
        <Skeleton className="h-3 w-32" />

        <Skeleton className="mt-3 h-5 w-4/5" />
        <Skeleton className="mt-2.5 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-3/4" />

        <div className="mt-5 flex items-center gap-4 border-t border-sand-200 pt-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  )
}

interface PropertyGridSkeletonProps {
  count?: number
  className?: string
}

/** Grid of card placeholders used for the first (unhydrated) load. */
export function PropertyGridSkeleton({ count = 6, className }: PropertyGridSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7', className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  )
}
