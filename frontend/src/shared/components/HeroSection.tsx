import { images } from '@/assets/images'
import { getStats } from '@/data'
import { formatNumber } from '@/shared/lib/format'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'

export function HeroSection() {
  const stats = getStats()

  return (
    <section className="relative overflow-hidden bg-white pb-32 pt-28 sm:pb-36 lg:pb-40 lg:pt-36" aria-labelledby="hero-heading">
      {/* Soft orange ambient wash */}
      <div
        aria-hidden
        className="blob-orange absolute -right-24 top-24 hidden h-[28rem] w-[28rem] rounded-[3rem] opacity-20 lg:block"
      />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-sand-200" />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14 2xl:gap-20">
          {/* Copy */}
          <div className="animate-fade-up">
            {/* Eyebrow badge */}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-50 px-3.5 py-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-accent-700">
              <Icon name="star" className="size-3 fill-accent-600 text-accent-600" />
              Premium Real Estate Service
            </span>

            {/* Heading */}
            <h1
              id="hero-heading"
              className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl lg:text-[3.5rem] 2xl:text-6xl lg:leading-[1.12]"
            >
              Find a Place That<br />
              <span className="text-accent-600">Feels Like Yours.</span>
            </h1>

            {/* Paragraph */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
              Curated luxury homes and investment opportunities in premium locations. Your journey to a perfect home starts here.
            </p>

            {/* Action Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/properties" variant="primary" size="lg" withArrow>
                Explore Properties
              </ButtonLink>
              <ButtonLink href="/contact?type=inspection" variant="outline" size="lg">
                Book an Inspection
              </ButtonLink>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-ink-600">
              <span className="inline-flex items-center gap-2">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <Icon name="check" className="size-2.5" strokeWidth={3} />
                </span>
                Verified listings only
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-sky-500 text-white shadow-xs">
                  <Icon name="clock" className="size-2.5" strokeWidth={2.5} />
                </span>
                Inspections within 48h
              </span>
            </div>
          </div>

          {/* Media with Integrated Glass Stats Card */}
          <div className="animate-fade-up-slow relative" style={{ animationDelay: '120ms' }}>
            {/* Image card container */}
            <div className="relative z-10 overflow-hidden rounded-[2.25rem] border border-sand-200/60 shadow-md sm:rounded-[2.75rem] lg:rounded-[3rem]">
              <SkeletonImage
                src={images.hero.main}
                alt="Contemporary luxury villa with pool at dusk, photographed for Novera Estates"
                width={1400}
                height={1000}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/3] w-full object-cover lg:aspect-[5/4] xl:aspect-[4/3]"
              />

              {/* Bottom gradient scrim for legibility */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
              />

              {/* Floating Glass Stats Bar */}
              <div className="absolute inset-x-3 bottom-3 z-20 sm:inset-x-5 sm:bottom-5 lg:inset-x-6 lg:bottom-6">
                <div className="rounded-2xl border border-white/50 bg-white/90 p-4 shadow-sm backdrop-blur-md sm:p-5">
                  <dl className="grid grid-cols-3 divide-x divide-sand-300 text-center">
                    {stats.map((stat) => (
                      <div key={stat.id} className="px-2">
                        <dt className="font-display text-xl font-extrabold text-ink-900 sm:text-2xl lg:text-3xl">
                          {formatNumber(stat.value)}{stat.suffix}
                        </dt>
                        <dd className="mt-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-ink-500 sm:text-xs">
                          {stat.label.replace('Experience', 'Exp.')}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
