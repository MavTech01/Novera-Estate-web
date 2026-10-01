import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { company } from '@/data/company'

/**
 * Closing call to action for the projects page.
 *
 * Separate from the global `CTASection` because it routes to inspection booking
 * rather than the general property search — a visitor who has just read about a
 * development wants to see the site.
 */
export function ProjectsClosingCta() {
  return (
    <Section tone="white">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink-700 px-8 py-14 shadow-lg sm:px-12 lg:px-16 lg:py-16">
            <div
              aria-hidden
              className="blob-orange absolute -right-16 -top-16 size-72 rounded-[3rem] opacity-25"
            />

            <div className="relative max-w-2xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <span aria-hidden className="h-px w-6 bg-accent-300/60" />
                Book a site inspection
              </p>

              <h2 className="mt-4 text-white">Interested in a Development?</h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                Book an inspection to see our developments first-hand, or speak with a Novera Estates agent
                about availability and payment plans.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/contact?type=inspection" variant="onBrown" size="lg" withArrow>
                  Book an Inspection
                </ButtonLink>
                <ButtonLink
                  href={`tel:${company.phoneHref}`}
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Icon name="phone" className="size-4" strokeWidth={2} />
                  {company.phone}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}