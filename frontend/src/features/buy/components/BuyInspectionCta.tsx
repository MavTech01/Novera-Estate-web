import { company } from '@/data/company'
import { routes } from '@/shared/lib/routes'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'

/**
 * "See It Before You Decide" — the brown conversion band, pointing at the
 * inspection route and the phone number.
 *
 * The primary action goes to the planned `/book-inspection` route, which
 * currently renders a "coming soon" notice. That is deliberate: the Buy page
 * promises a booking flow, the notice says plainly that it is not built yet, and
 * the phone number beside it is a working alternative in the meantime.
 */
export function BuyInspectionCta() {
  return (
    <Section tone="brown" ariaLabelledBy="buy-inspection-heading">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <Icon name="calendar-search" className="size-4" strokeWidth={2} />
                Private viewings
              </p>

              <h2 id="buy-inspection-heading" className="mt-4 text-white">
                See It Before You Decide
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                Photos help, but a home is a place you have to stand in. Our online booking flow is
                on the way — until then, call the office and we will arrange a viewing around your
                schedule.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href={routes.bookInspection} variant="onBrown" size="lg" withArrow>
                Book an Inspection
              </ButtonLink>
              <ButtonLink
                href={`tel:${company.phoneHref}`}
                variant="white"
                size="lg"
                className="border border-white/30"
              >
                <Icon name="phone" className="size-4" strokeWidth={2} />
                {company.phone}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}