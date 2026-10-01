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
 * Kept separate from the global `CTASection` because its second question is
 * different: after browsing areas, a visitor is deciding *where* to look, so
 * the primary route is the properties catalogue and the alternative is a
 * conversation with an agent.
 */
export function LocationsClosingCta() {
  return (
    <Section tone="white">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink-700 px-8 py-14 shadow-lg sm:px-12 lg:px-16 lg:py-16">
            <div aria-hidden className="blob-orange absolute -right-16 -top-16 size-72 rounded-[3rem] opacity-25" />

            <div className="relative max-w-2xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <span aria-hidden className="h-px w-6 bg-accent-300/60" />
                Talk to an agent
              </p>

              <h2 className="mt-4 text-white">Not Sure Which Location Is Right for You?</h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                Tell us what you're looking for and our team can help you explore suitable properties and
                developments.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={routes.properties} variant="onBrown" size="lg" withArrow>
                  Explore Properties
                </ButtonLink>
                <ButtonLink
                  href={navigationCta.href}
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Icon name="calendar-search" className="size-4" strokeWidth={2} />
                  {navigationCta.label}
                </ButtonLink>
              </div>

              <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
                <Icon name="phone" className="size-4 shrink-0" strokeWidth={2} />
                Prefer to call?{' '}
                <a
                  href={`tel:${company.phoneHref}`}
                  className="font-semibold text-white underline-offset-4 transition-colors duration-200 hover:text-accent-300 hover:underline"
                >
                  {company.phone}
                </a>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
