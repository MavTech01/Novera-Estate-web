import { faqItems } from '@/features/faq'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { FaqAccordion } from '@/shared/components/ui/FaqAccordion'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { routes } from '@/shared/lib/routes'

/**
 * `/faq` — every question worth answering, in one list.
 *
 * Deliberately a single list rather than a searched, categorised index: the
 * contact and rent pages each show a short preview, and both need somewhere to
 * point for the rest. Grouping only starts earning its keep once there are enough
 * questions to fill more than one section.
 */
export function FaqPage() {
  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <Section tone="white" spacing="tight" className="pt-16 sm:pt-20">
        <Container>
          <SectionHeading
            eyebrow="Good to know"
            title="Frequently Asked Questions"
            description="The questions we are asked most often about reaching us, viewings, renting, saving properties and the current state of this site."
            align="center"
          />

          <div className="mx-auto mt-12 max-w-3xl">
            <FaqAccordion items={faqItems} idPrefix="site-faq" />
          </div>

          <Reveal>
            <div className="mx-auto mt-12 flex max-w-3xl flex-col items-start gap-6 rounded-2xl border border-accent-200 bg-tint-50 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg text-ink-900">Still have a question?</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Ask us directly — a named consultant replies within one working day, and it costs
                  nothing to find out.
                </p>
              </div>

              <ButtonLink href={routes.contact} variant="primary" size="lg" withArrow className="shrink-0">
                <Icon name="message" className="size-4" strokeWidth={2} />
                Contact us
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  )
}
