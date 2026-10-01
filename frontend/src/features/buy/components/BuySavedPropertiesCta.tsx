import { routes } from '@/shared/lib/routes'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'

/**
 * "Save It For Later" — points buyers at the heart button on every property
 * card in the catalogue, since a saved set is the natural seed for the team's
 * shortlist conversation.
 */
export function BuySavedPropertiesCta() {
  return (
    <Section tone="white" spacing="none" ariaLabelledBy="buy-saved-cta-heading" className="pb-0">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 rounded-2xl border border-accent-200 bg-tint-50 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-700">
                <Icon name="heart" className="size-4" strokeWidth={2} />
                Save it for later
              </p>
              <h2 id="buy-saved-cta-heading" className="mt-4 text-ink-900">
                Found Something You Like?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                Tap the heart on any property to save it to your shortlist. When you've narrowed it
                down, share your shortlist with us and we'll arrange the viewings together.
              </p>
            </div>

            <ButtonLink href={routes.properties} variant="primary" size="lg" withArrow className="shrink-0">
              Browse and save
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}