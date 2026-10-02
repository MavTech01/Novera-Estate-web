import { Container } from '@/shared/components/ui/Container'
import { Skeleton } from '@/shared/components/ui/Skeleton'

/**
 * Full-page loading state for a project detail page.
 *
 * Mirrors the real page's structure — dark hero, gallery, then the two-column
 * reading area with its sticky summary — so the page does not visibly jump as
 * each part resolves. It uses the same `Container` as the live page rather than
 * its own `max-w-7xl`, which was a slightly wider rail than anything it stands in
 * for.
 *
 * Purely decorative: the wrapper is `aria-hidden`, and the status message below
 * is what a screen reader hears.
 */
export function ProjectDetailsSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading project details…</span>

      <div aria-hidden className="animate-pulse">
        {/* Hero — top padding matches the fixed navbar, as on the real page. */}
        <div className="bg-ink-800 pt-[7.5rem] pb-14 sm:pb-16 lg:pt-[8.5rem] lg:pb-20">
          <Container>
            <Skeleton className="h-3 w-40 bg-white/10" />

            <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <Skeleton className="h-6 w-28 rounded-pill bg-white/10" />
                <Skeleton className="mt-5 h-12 w-full max-w-md bg-white/10" />
                <Skeleton className="mt-4 h-4 w-56 bg-white/10" />
                <Skeleton className="mt-5 h-4 w-full max-w-xl bg-white/10" />
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Skeleton className="h-14 w-full rounded-md bg-white/10 sm:w-48" />
                  <Skeleton className="h-14 w-full rounded-md bg-white/10 sm:w-52" />
                </div>
              </div>

              <div className="lg:col-span-5">
                <Skeleton className="h-52 rounded-2xl bg-white/10" />
              </div>
            </div>
          </Container>
        </div>

        {/* Gallery */}
        <div className="bg-white pt-8 lg:pt-10">
          <Container>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_9.5rem]">
              <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-sand-200" />
              <div className="hidden grid-rows-3 gap-3 lg:grid">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} className="aspect-[4/3] w-full rounded-xl bg-sand-200" />
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Two-column reading area */}
        <div className="bg-white pt-8 pb-14 lg:pb-20">
          <Container>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="space-y-6 lg:col-span-8 lg:space-y-8 xl:col-span-9">
                {/* Overview */}
                <div className="rounded-2xl border border-sand-200 bg-white p-6 sm:p-8 lg:p-10">
                  <Skeleton className="h-8 w-64 bg-sand-200" />
                  <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-sand-200">
                    {Array.from({ length: 8 }, (_, index) => (
                      <Skeleton key={index} className="h-20 bg-sand-100" />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-2xl border border-sand-200 bg-tint-50 p-6 sm:p-8 lg:p-10">
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-7">
                      <Skeleton className="h-8 w-72 bg-sand-200" />
                      <Skeleton className="mt-5 h-4 w-full bg-sand-200" />
                      <Skeleton className="mt-3 h-4 w-full bg-sand-200" />
                      <Skeleton className="mt-3 h-4 w-4/5 bg-sand-200" />
                    </div>
                    <div className="space-y-4 lg:col-span-5">
                      <Skeleton className="h-24 rounded-xl bg-white/70" />
                      <Skeleton className="h-24 rounded-xl bg-white/70" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4 xl:col-span-3">
                <Skeleton className="h-72 rounded-2xl bg-sand-100" />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  )
}
