import { company, getStats } from '@/data'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { StatCard } from '@/shared/components/ui/StatCard'

/**
 * Two-column hero: message on the left, property photography on the right
 * with an orange accent shape behind it, and a trust counter row underneath.
 */
export function HeroSection() {
  const stats = getStats()

  return (
    <section className="relative overflow-hidden bg-white pb-40 pt-28 lg:pb-44 lg:pt-36" aria-labelledby="hero-heading">
      {/* Soft orange wash behind the media column */}
      <div
        aria-hidden
        className="blob-orange absolute -right-24 top-24 hidden h-[26rem] w-[26rem] rounded-[3rem] opacity-25 lg:block"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-sand-200" />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-pill bg-tint-50 px-4 py-1.5 text-[length:var(--text-label)] uppercase leading-4 text-accent-700">
              <Icon name="sparkles" className="size-3.5" strokeWidth={2.2} />
              {company.descriptor}
            </p>

            <h1 id="hero-heading" className="mt-6 text-ink-900">
              {company.tagline}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
              Discover exceptional homes, land, and investment opportunities in carefully selected locations.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/properties" variant="primary" size="lg" withArrow>
                Explore Properties
              </ButtonLink>
              <ButtonLink href="/contact?type=inspection" variant="outline" size="lg">
                Book an Inspection
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
              <span className="flex items-center gap-2">
                <Icon name="shield-check" className="size-4 text-accent-500" strokeWidth={2} />
                Verified listings only
              </span>
              <span className="flex items-center gap-2">
                <Icon name="calendar-search" className="size-4 text-accent-500" strokeWidth={2} />
                Inspections within 48 hours
              </span>
            </div>
          </div>

          {/* Media */}
          <div className="animate-fade-up-slow relative" style={{ animationDelay: '120ms' }}>
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
              <SkeletonImage
                src="/images/hero/hero-main.webp"
                alt="Contemporary family home with landscaped garden, photographed for Novera Estates"
                width={1400}
                height={1000}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/3] w-full"
              />
            </div>

            {/* Floating proof card */}
            <div className="absolute -bottom-6 -left-4 z-20 flex items-center gap-3 rounded-xl bg-white p-4 shadow-md sm:-left-8">
              <span className="flex size-11 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                <Icon name="users" className="size-5" strokeWidth={2} />
              </span>
              <span className="flex flex-col">
                <span className="font-display text-lg font-bold leading-none text-ink-900">1,200+</span>
                <span className="mt-1 text-xs text-ink-500">clients guided since 2015</span>
              </span>
            </div>
          </div>
        </div>

        {/* Trust counters */}
        <Reveal className="mt-12 sm:mt-16 lg:mt-20">
          <div className="rounded-2xl border border-sand-200/90 bg-gradient-to-b from-white via-white to-tint-50/40 p-3 shadow-sm backdrop-blur-xs sm:p-7 sm:shadow-md">
            <dl className="grid grid-cols-3 divide-x divide-sand-200" aria-label="Novera Estates in numbers">
              {stats.map((stat) => (
                <div key={stat.id} className="px-1.5 sm:px-6 first:pl-0 sm:first:pl-2 last:pr-0 sm:last:pr-2">
                  <StatCard stat={stat} active />
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
