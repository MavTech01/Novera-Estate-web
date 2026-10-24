import { contactFaq } from '@/features/contact/data/contactData'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { GoodToKnowSection } from '@/shared/components/ui/GoodToKnowSection'
import { routes } from '@/shared/lib/routes'

/**
 * FAQ preview on the contact page — the four most common questions people have
 * before writing, with a link to the full `/faq` page for anything else.
 */
export function ContactFaqPreview() {
  return (
    <GoodToKnowSection
      idPrefix="contact-faq-preview"
      title="Quick Answers About Getting In Touch"
      description="A few things that usually clear up first — location, response time, viewings and commitments."
      action={
        <ArrowLink href={routes.faq} size="md">
          View All FAQs
        </ArrowLink>
      }
      items={contactFaq}
    />
  )
}
