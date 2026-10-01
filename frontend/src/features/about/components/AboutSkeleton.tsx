import { Container } from '@/shared/components/ui/Container'
import { Skeleton } from '@/shared/components/ui/Skeleton'

/**
 * Structural placeholder for a direct load of `/about`.
 *
 * `routeManifest` preloads the page content before the route commits, so this
 * is only ever seen on a cold load or a cold cache. It mirrors the hero and the
 * first grid in rough proportion to keep the page from reflowing once the real
 * content arrives.
 *
 * Marked `aria-hidden`: it carries no information, and announcing a loading
 * region is handled by the page's own live status instead.
 */
export function AboutSkeleton() {
  return (
    <div className="bg-sand-100 pt-16 sm:pt-20 lg:pt-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 pb-20 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-48 rounded-pill" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <div className="mt-4 flex gap-3">
              <Skeleton className="h-14 w-44 rounded-md" />
              <Skeleton className="h-14 w-48 rounded-md" />
            </div>
          </div>

          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        </div>
      </Container>

      <div className="bg-white py-20">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        </Container>
      </div>
    </div>
  )
}