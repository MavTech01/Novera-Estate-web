import { cn } from '@/shared/lib/cn'
import { Skeleton } from '@/shared/components/ui/Skeleton'

interface PropertyDetailSkeletonProps {
  className?: string
}

/**
 * Loading state for `/properties/:slug`.
 *
 * Mirrors the real layout section by section — media, title, price, overview
 * strip, sidebar — so nothing jumps when the listing arrives. Ready-made for
 * the `GET /api/properties/:slug` round trip.
 */
export function PropertyDetailSkeleton({ className }: PropertyDetailSkeletonProps) {
  return (
    <div role="status" aria-label="Loading property" className={cn('min-w-0', className)}>
      {/* Gallery + header row */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-10">
        <div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl sm:aspect-[16/10]" />
          <div className="mt-3 flex gap-2.5">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="aspect-[4/3] w-20 rounded-lg sm:w-24" />
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-pill" />
            <Skeleton className="h-7 w-32 rounded-pill" />
          </div>

          <Skeleton className="mt-5 h-9 w-full" />
          <Skeleton className="mt-2.5 h-9 w-3/4" />
          <Skeleton className="mt-4 h-4 w-56" />

          <Skeleton className="mt-7 h-10 w-48" />
          <Skeleton className="mt-3 h-3 w-32" />

          <div className="mt-6 flex gap-5 border-y border-sand-200 py-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="mt-5 flex gap-2.5">
            <Skeleton className="size-11 rounded-pill" />
            <Skeleton className="h-11 w-28 rounded-md" />
          </div>
        </div>
      </div>

      {/* Overview strip */}
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-sand-200 bg-sand-200 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex flex-col items-center gap-2 bg-white px-4 py-5">
            <Skeleton className="size-5 rounded-md" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>

      {/* Content + sidebar */}
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-10">
        <div className="min-w-0 space-y-10">
          <div>
            <Skeleton className="h-7 w-56" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2.5 h-4 w-11/12" />
            <Skeleton className="mt-2.5 h-4 w-4/5" />
          </div>

          <div>
            <Skeleton className="h-7 w-48" />
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-md" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-sand-200 bg-white p-6">
            <Skeleton className="h-3 w-32" />
            <div className="mt-5 flex items-center gap-4">
              <Skeleton className="size-16 rounded-pill" />
              <div className="flex-1">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="mt-2 h-3.5 w-44" />
              </div>
            </div>
            <div className="mt-6 space-y-3 border-t border-sand-200 pt-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="mt-6 h-12 w-full rounded-md" />
            <Skeleton className="mt-2.5 h-12 w-full rounded-md" />
          </div>

          <div className="rounded-xl border border-accent-200 bg-tint-50 p-6">
            <Skeleton className="size-11 rounded-pill" />
            <Skeleton className="mt-4 h-6 w-56" />
            <Skeleton className="mt-2.5 h-4 w-full" />
            <Skeleton className="mt-6 h-14 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
