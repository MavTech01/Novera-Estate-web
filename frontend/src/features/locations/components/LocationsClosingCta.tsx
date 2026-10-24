import { company, navigationCta } from '@/data'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { routes } from '@/shared/lib/routes'

/**
 * Closing call to action for the locations page.
 *
 * Refined with smooth concentric curved rings and ambient glow in the background.
 */
export function LocationsClosingCta() {
  return (
    <Section
      tone="white"
      spacing="none"
      className="pt-2 sm:pt-4 lg:pt-6 pb-20 sm:pb-24 lg:pb-28"
      ariaLabelledBy="locations-closing-cta-heading"
    >
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink-700 px-8 py-12 shadow-xl sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between lg:px-16 lg:py-16">
            {/* Decorative smooth curved architectural rings & warm ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 select-none sm:-right-20 sm:-top-20 lg:-right-16 lg:-top-16"
            >
              {/* Soft luminous ambient warmth */}
              <div className="absolute inset-0 size-80 rounded-full bg-gradient-to-br from-accent-400/25 via-accent-500/10 to-transparent blur-3xl sm:size-96" />

              {/* Concentric curved rings */}
              <div className="relative flex size-80 items-center justify-center sm:size-[26rem] lg:size-[30rem]">
                <div className="absolute size-full rounded-full border border-white/[0.07]" />
                <div className="absolute size-[78%] rounded-full border border-accent-300/[0.14]" />
                <div className="absolute size-[56%] rounded-full border border-accent-400/[0.20]" />
                <div className="absolute size-[34%] rounded-full bg-gradient-to-br from-accent-400/25 to-accent-600/5 blur-sm" />
              </div>
            </div>

            <div className="relative max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <Icon name="map-pin" className="size-4 text-accent-300" strokeWidth={2} />
                Talk to an agent
              </p>

              <h2
                id="locations-closing-cta-heading"
                className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
              >
                Not Sure Which Location Is Right for You?
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/75">
                Tell us what you're looking for and our team can help you explore suitable properties and
                developments across Lagos.
              </p>

              <p className="mt-5 flex items-center gap-2 text-sm text-white/60">
                <Icon name="phone" className="size-4 shrink-0 text-accent-300" strokeWidth={2} />
                Prefer to call directly?{' '}
                <a
                  href={`tel:${company.phoneHref}`}
                  className="font-semibold text-white underline-offset-4 transition-colors duration-200 hover:text-accent-300 hover:underline"
                >
                  {company.phone}
                </a>
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-0 lg:shrink-0">
              <ButtonLink href={routes.properties} variant="onBrown" size="lg" withArrow>
                Explore Properties
              </ButtonLink>
              <ButtonLink
                href={navigationCta.href}
                variant="glassDark"
                size="lg"
              >
                <Icon name="calendar-search" className="size-4 text-accent-300" strokeWidth={2} />
                {navigationCta.label}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
