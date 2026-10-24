import { useSearchParams } from 'react-router-dom'
import {
  CONTACT_HERO_IMAGE,
  ContactEnquiryForm,
  ContactFaqPreview,
  ContactFinalCta,
  ContactInfoCards,
  ContactMapPlaceholder,
  enquiryTypeFromQuery,
} from '@/features/contact'
import { company } from '@/data/company'
import { PageHero } from '@/shared/components/layout/PageHero'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import { buildCallUrl } from '@/shared/lib/contactLinks'

/**
 * Contact page — every way to reach the agency, and a form that asks for what a
 * consultant needs to answer usefully.
 *
 * Thin by design, like the other pages: the form's state lives in
 * `useContactEnquiry`, its rules in `contactForm`, and its transport in
 * `contactService`. This file decides the order of the sections and nothing else.
 *
 * The one thing the page reads from its own URL is `?type=…`, so the header's
 * "Book an Inspection" CTA arrives with that enquiry already selected rather than
 * making the visitor choose it again.
 *
 * Tones alternate so consecutive sections never blend: warm hero → tint contact
 * details → white form → tint map → white FAQ preview → brown closing band.
 */
export function ContactPage() {
  const [query] = useSearchParams()
  const initialType = enquiryTypeFromQuery(query.get('type'))

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <PageHero
        eyebrow="Get in touch"
        title="Let's Find the Right Property for You"
        description="Whether you are buying, renting, selling or simply weighing up your options in Lagos, tell us what you need and a consultant will come back to you within one working day."
        image={CONTACT_HERO_IMAGE}
        breadcrumbs={pageCrumbs({ label: 'Contact Us' })}
        actions={[
          { label: 'Send an Enquiry', href: '#contact-enquiry', withArrow: true },
          { label: 'Call the Office', href: buildCallUrl(company.phone), variant: 'white', icon: 'phone' },
        ]}
        trust={[
          { id: 'response', icon: 'clock', label: 'Reply within one working day' },
          { id: 'viewings', icon: 'calendar-check', label: 'Free inspections, no obligation' },
          { id: 'advice', icon: 'shield-check', label: 'Honest advice, even when it means no' },
        ]}
      />

      <ContactInfoCards />

      <div id="contact-enquiry" className="scroll-mt-24">
        <ContactEnquiryForm initialType={initialType} />
      </div>

      <div id="contact-map" className="scroll-mt-24">
        <ContactMapPlaceholder />
      </div>

      <ContactFaqPreview />

      <ContactFinalCta />
    </main>
  )
}
