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
      <div className="bg-sand-100 pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pb-36 lg:pt-24">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-7 w-52 rounded-pill" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <div className="mt-4 flex gap-3">
                <Skeleton className="h-14 w-44 rounded-md" />
                <Skeleton className="h-14 w-52 rounded-md" />
              </div>
            </div>

            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          </div>
        </Container>
      </div>

      <Container>
        <Skeleton className="h-56 w-full rounded-2xl" />
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