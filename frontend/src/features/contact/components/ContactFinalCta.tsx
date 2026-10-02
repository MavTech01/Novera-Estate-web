import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { routes } from '@/shared/lib/routes'

/**
 * "Have a Property in Mind?" — the closing CTA.
 *
 * Points both ways: to the catalogue for someone still browsing, and to the
 * inspection route for someone who knows exactly what they want to see. The
 * brown surface matches the other closing bands on the site.
 */
export function ContactFinalCta() {
  return (
    <Section tone="brown" ariaLabelledBy="contact-final-cta-heading">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <Icon name="sparkles" className="size-4" strokeWidth={2} />
                Take the next step
              </p>

              <h2 id="contact-final-cta-heading" className="mt-4 text-white">
                Have a Property in Mind?
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                Explore what is available across Lagos, or tell us exactly what you're looking for
                and we'll shortlist it for you. Viewings are free and come with no obligation.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href={routes.properties} variant="onBrown" size="lg" withArrow>
                Explore Properties
              </ButtonLink>
              <ButtonLink
                href={routes.bookInspection}
                variant="white"
                size="lg"
                className="border border-white/30"
              >
                <Icon name="calendar-search" className="size-4" strokeWidth={2} />
                Book an Inspection
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
