import { FaqAccordion } from '@/shared/components/ui/FaqAccordion'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { RentFaqItem } from '@/features/rent/types/rent.types'

interface RentFaqProps {
  items: readonly RentFaqItem[]
}

/**
 * Accessible renting FAQ, reusing the shared accordion so a question reads the
 * same here as it does on the Contact page and `/faq`.
 */
export function RentFaq({ items }: RentFaqProps) {
  return (
    <Section tone="tint" ariaLabelledBy="rent-faq-heading">
      <Container>
        <SectionHeading
          id="rent-faq-heading"
          eyebrow="Good to know"
          title="Questions Renters Ask Us"
          description="Straight answers about property searches, viewings, inspections, and tenancy costs."
        />

        <div className="mt-12 mx-auto max-w-3xl">
          <FaqAccordion items={items} idPrefix="rent-faq" />
        </div>
      </Container>
    </Section>
  )
}
