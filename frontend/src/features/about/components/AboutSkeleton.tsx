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
    <div>
      <div className="relative isolate flex min-h-[clamp(34rem,72vh,40rem)] flex-col overflow-hidden bg-ink-800">
        <Container className="relative z-10 flex flex-1 flex-col justify-center pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-32 lg:pb-24">
          <div className="flex w-full max-w-[45rem] flex-col gap-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <div className="mt-1 flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-12 w-full rounded-md sm:h-13 sm:w-44" />
              <Skeleton className="h-12 w-full rounded-md sm:h-13 sm:w-48" />
            </div>
            <Skeleton className="mt-2 h-4 w-full" />
          </div>
        </Container>
        <div className="h-15 w-full lg:h-28" />
      </div>

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