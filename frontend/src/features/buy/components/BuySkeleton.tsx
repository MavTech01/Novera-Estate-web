import { Container } from '@/shared/components/ui/Container'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { PropertyGridSkeleton } from '@/components/properties/PropertySkeleton'
import { BUY_FEATURED_LIMIT } from '@/features/buy/services/buyService'

/**
 * Structural placeholder for a cold load of `/buy`.
 *
 * `routeManifest` preloads the catalogue and the featured grid before the route
 * commits, so this only appears when both are cold. It mirrors the hero, the
 * search panel, the category grid and the featured grid in rough proportion so
 * the page does not reflow when the real content arrives.
 *
 * `aria-hidden`: it carries no information — the page's own live status reports
 * loading.
 */
export function BuySkeleton() {
  return (
    <div>
      <div className="relative isolate flex min-h-[clamp(34rem,72vh,40rem)] flex-col overflow-hidden bg-ink-800">
        <Container className="relative z-10 flex flex-1 flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-32 lg:pb-24">
          <div className="flex w-full max-w-[45rem] flex-col gap-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <div className="mt-1 flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-12 w-full rounded-md sm:h-13 sm:w-44" />
              <Skeleton className="h-12 w-full rounded-md sm:h-13 sm:w-52" />
            </div>
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        </Container>
        <div className="h-15 w-full lg:h-28" />
      </div>

      <Container>
        {/* Matches `BuySearchPanel`: it only overlaps the wave from `lg` up. */}
        <Skeleton className="h-56 w-full rounded-2xl lg:-mt-6" />
      </Container>

      <div className="bg-white py-20 pt-14 sm:py-24 sm:pt-16">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        </Container>
      </div>

      <div className="bg-sand-100 py-20">
        <Container>
          <PropertyGridSkeleton count={BUY_FEATURED_LIMIT} />
        </Container>
      </div>
    </div>
  )
}