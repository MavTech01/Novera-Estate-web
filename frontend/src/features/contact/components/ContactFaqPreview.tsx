import { contactFaq } from '@/features/contact/data/contactData'
import { FaqAccordion } from '@/shared/components/ui/FaqAccordion'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { routes } from '@/shared/lib/routes'

/**
 * FAQ preview on the contact page — the four most common questions people have
 * before writing, with a link to the full `/faq` page for anything else.
 *
 * Reuses the shared accordion so a question reads the same here and there.
 */
export function ContactFaqPreview() {
  return (
    <Section tone="tint" ariaLabelledBy="contact-faq-preview-heading">
      <Container>
        <SectionHeading
          id="contact-faq-preview-heading"
          eyebrow="Good to know"
          title="Quick Answers About Getting In Touch"
          description="A few things that usually clear up first — location, response time, viewings and commitments."
          action={
            <ArrowLink href={routes.faq} size="md">
              View All FAQs
            </ArrowLink>
          }
        />

        <div className="mt-12 mx-auto max-w-3xl">
          <FaqAccordion items={contactFaq} idPrefix="contact-faq-preview" />
        </div>
      </Container>
    </Section>
  )
}
