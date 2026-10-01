import { Skeleton } from '@/shared/components/ui/Skeleton'

/**
 * Full-page loading state for a project detail page.
 *
 * Mirrors the real page's section rhythm — dark hero, then alternating light and
 * tinted bands — so the page does not visibly jump as each part resolves. Purely
 * decorative: it is `aria-hidden`, and the status message below is what a screen
 * reader hears.
 */
export function ProjectDetailsSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading project details…</span>

      <div aria-hidden className="animate-pulse">
        {/* Hero */}
        <div className="bg-ink-800 pt-8 pb-16 sm:pt-10 sm:pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Skeleton className="h-3 w-40 bg-white/10" />
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <Skeleton className="h-6 w-28 rounded-pill bg-white/10" />
                <Skeleton className="mt-5 h-11 w-full max-w-md bg-white/10" />
                <Skeleton className="mt-4 h-4 w-56 bg-white/10" />
                <Skeleton className="mt-5 h-4 w-full max-w-xl bg-white/10" />
                <div className="mt-8 flex gap-3">
                  <Skeleton className="h-14 w-44 rounded-md bg-white/10" />
                  <Skeleton className="h-14 w-48 rounded-md bg-white/10" />
                </div>
              </div>

              <div className="lg:col-span-4">
                <Skeleton className="h-40 rounded-2xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Skeleton className="aspect-[16/10] w-full rounded-2xl bg-sand-200" />
            <div className="mt-3 hidden grid-cols-6 gap-3 sm:grid">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="aspect-[16/10] w-full rounded-lg bg-sand-200" />
              ))}
            </div>
          </div>
        </div>

        {/* Overview grid */}
        <div className="bg-white pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <Skeleton className="h-8 w-64 bg-sand-200" />
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-sand-200 sm:grid-cols-4">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-24 bg-sand-100" />
              ))}
            </div>
          </div>
        </div>

        {/* Description + tinted band */}
        <div className="bg-tint-50 py-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <Skeleton className="h-8 w-72 bg-sand-200" />
                <Skeleton className="mt-5 h-4 w-full bg-sand-200" />
                <Skeleton className="mt-3 h-4 w-full bg-sand-200" />
                <Skeleton className="mt-3 h-4 w-4/5 bg-sand-200" />
              </div>
              <Skeleton className="h-64 rounded-xl bg-sand-200" />
            </div>
          </div>
        </div>

        {/* Unit types */}
        <div className="bg-tint-50 pb-20">
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-72 rounded-xl bg-white" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
