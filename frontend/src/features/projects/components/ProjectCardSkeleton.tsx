import { cn } from '@/shared/lib/cn'
import { Skeleton } from '@/shared/components/ui/Skeleton'

interface ProjectCardSkeletonProps {
  className?: string
  /** Dims the block while a background refresh is in flight. */
  isRefreshing?: boolean
}

/**
 * Placeholder that mirrors `ProjectCard` — media, status pill, location, title,
 * summary, price, availability, progress and footer — so the grid does not
 * reflow when results arrive.
 */
export function ProjectCardSkeleton({ className, isRefreshing = false }: ProjectCardSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading project"
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm',
        isRefreshing && 'opacity-60',
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-24 rounded-pill" />
        </div>

        <Skeleton className="mt-4 h-3 w-32" />
        <Skeleton className="mt-2.5 h-5 w-4/5" />
        <Skeleton className="mt-3 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-3/4" />

        <div className="mt-4 border-t border-sand-200 pt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-6 w-40" />
          <Skeleton className="mt-3 h-3.5 w-32" />
        </div>

        <div className="mt-4">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="mt-2 h-1.5 w-full rounded-pill" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-sand-200 pt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  )
}

interface ProjectGridSkeletonProps {
  count?: number
  className?: string
}

/** Grid of card placeholders used for the first (unhydrated) load. */
export function ProjectGridSkeleton({ count = 6, className }: ProjectGridSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7', className)}
    >
      {Array.from({ length: count }, (_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  )
}
