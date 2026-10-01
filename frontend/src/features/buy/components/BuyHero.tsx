import { BUY_HERO_IMAGE } from '@/features/buy/services/buyService'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { routes } from '@/shared/lib/routes'
import type { IconName } from '@/types'

/**
 * Buy page hero: the promise, one photograph of a Lagos home, and the two ways
 * forward — start searching below, or book a conversation about buying.
 *
 * No statistics appear here on purpose, for the same reason as the About hero:
 * there is no verified inventory count to quote yet, and an invented one would
 * be the first thing a serious buyer discounted.
 */
export function BuyHero() {
  return (
    <section
      className="relative overflow-hidden bg-sand-100 pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pb-36 lg:pt-24"
      aria-labelledby="buy-hero-heading"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-sand-200" />
      <div
        aria-hidden
        className="blob-orange absolute -right-28 -top-24 hidden size-[26rem] rounded-[4rem] opacity-20 lg:block"
      />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-1.5 text-[length:var(--text-label)] uppercase leading-4 text-accent-700 shadow-xs">
              <Icon name="key" className="size-3.5" strokeWidth={2.2} />
              Buy property in Lagos
            </p>

            <h1 id="buy-hero-heading" className="mt-6 text-ink-900">
              Find a Property Worth Coming Home To.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              Browse homes, apartments, land and development opportunities across Lekki, Ikoyi,
              Ikeja and beyond — then let our team guide you through every step, from first
              viewing to handover.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="#buy-search" size="lg" withArrow>
                Start Your Search
              </ButtonLink>
              <ButtonLink href={routes.bookInspection} variant="outline" size="lg">
                <Icon name="calendar-search" className="size-4" strokeWidth={2} />
                Book an Inspection
              </ButtonLink>
            </div>

            {/* What the buyer can expect from working with us — capability, not a claim. */}
            <ul className="mt-10 flex flex-col gap-3 border-t border-sand-200 pt-8 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
              {(
                [
                  { id: 'inspection', icon: 'calendar-search', label: 'Private viewings arranged' },
                  { id: 'documentation', icon: 'file-text', label: 'Documentation walk-through' },
                  { id: 'areas', icon: 'map-pin', label: 'Guidance across Lagos areas' },
                ] satisfies { id: string; icon: IconName; label: string }[]
              ).map((highlight) => (
                <li key={highlight.id} className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-white text-accent-600 shadow-xs">
                    <Icon name={highlight.icon} className="size-4" strokeWidth={2} />
                  </span>
                  {highlight.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up-slow relative" style={{ animationDelay: '120ms' }}>
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
              <SkeletonImage
                src={BUY_HERO_IMAGE.src}
                alt={BUY_HERO_IMAGE.alt}
                width={1200}
                height={900}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/3] w-full"
              />
            </div>

            {/* Signature strip carrying the brand line the whole site uses. */}
            <div className="relative z-10 mt-5 flex items-center gap-3 rounded-xl border border-sand-200 bg-white p-4 shadow-md lg:absolute lg:-bottom-7 lg:-left-6 lg:mt-0 lg:w-max">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                <Icon name="compass" className="size-5" strokeWidth={2} />
              </span>
              <span className="flex flex-col">
                <span className="font-display text-sm font-bold leading-tight text-ink-900">
                  Guiding you home, one step at a time.
                </span>
                <span className="mt-1 text-xs text-ink-500">Sales &amp; acquisition support</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}