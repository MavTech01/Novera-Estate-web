import { buildRentPropertiesHref } from '@/features/rent/utils/rentQuery'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'

/**
 * "Keep Track of Rentals You Like" — points renters at the heart button on
 * every property card, since a saved set is the natural seed for the team's
 * inspection conversation.
 */
export function RentSavedPropertiesCta() {
  return (
    <Section tone="white" spacing="none" ariaLabelledBy="rent-saved-cta-heading" className="pb-0">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 rounded-2xl border border-accent-200 bg-tint-50 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-700">
                <Icon name="heart" className="size-4" strokeWidth={2} />
                Your shortlist
              </p>
              <h2 id="rent-saved-cta-heading" className="mt-4 text-ink-900">
                Keep Track of Rentals You Like
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                Tap the heart on any rental to save it. When you've narrowed it down, share your
                shortlist with us and we'll arrange the viewings together. A customer account that
                keeps your shortlist across visits is on the way.
              </p>
            </div>

            <ButtonLink
              href={buildRentPropertiesHref({})}
              variant="primary"
              size="lg"
              withArrow
              className="shrink-0"
            >
              Browse and save
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
