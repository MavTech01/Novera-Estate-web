import { routes } from '@/shared/lib/routes'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'

/**
 * "See Your Next Rental in Person" — the brown conversion band, pointing at the
 * inspection route and the contact page.
 *
 * The primary action goes to the planned `/book-inspection` route, which
 * currently renders a "coming soon" notice. That is deliberate: the page
 * promises a booking flow, the notice says plainly that it is not built yet, and
 * the contact link beside it is a working alternative in the meantime.
 */
export function RentInspectionCta() {
  return (
    <Section tone="brown" ariaLabelledBy="rent-inspection-heading">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <Icon name="calendar-search" className="size-4" strokeWidth={2} />
                Private viewings
              </p>

              <h2 id="rent-inspection-heading" className="mt-4 text-white">
                See Your Next Rental in Person
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                Photos help, but a home is a place you have to stand in. Arrange a viewing and we
                will show you around — until the online booking flow lands, get in touch and we will
                set it up around your schedule.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href={routes.bookInspection} variant="onBrown" size="lg" withArrow>
                Book an Inspection
              </ButtonLink>
              <ButtonLink
                href={routes.contact}
                variant="white"
                size="lg"
                className="border border-white/30"
              >
                <Icon name="message" className="size-4" strokeWidth={2} />
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
