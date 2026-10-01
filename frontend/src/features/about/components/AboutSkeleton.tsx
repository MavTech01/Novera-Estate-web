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
      <div className="relative isolate flex min-h-[clamp(22rem,46vh,30rem)] flex-col justify-end overflow-hidden bg-ink-800 pt-28 pb-14 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
        <Container className="relative z-10 flex w-full flex-1 items-end">
          <div className="flex w-full flex-col gap-5 lg:ml-auto lg:max-w-2xl lg:items-end">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <div className="mt-1 flex flex-wrap gap-3 lg:justify-end">
              <Skeleton className="h-14 w-44 rounded-md" />
              <Skeleton className="h-14 w-48 rounded-md" />
            </div>
          </div>
        </Container>
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