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
      <div className="relative isolate flex min-h-[clamp(18rem,36vh,24rem)] flex-col justify-end overflow-hidden bg-ink-800 pt-28 sm:pt-32 lg:pt-36">
        <Container className="relative z-10 flex w-full flex-1 items-end">
          <div className="flex w-full flex-col gap-5 lg:ml-auto lg:max-w-2xl lg:items-end">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <div className="mt-1 flex flex-wrap gap-3 lg:justify-end">
              <Skeleton className="h-14 w-44 rounded-md" />
              <Skeleton className="h-14 w-52 rounded-md" />
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <Skeleton className="h-56 w-full rounded-2xl lg:-mt-14" />
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