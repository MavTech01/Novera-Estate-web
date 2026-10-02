import type { FaqItem } from '@/shared/components/ui/FaqAccordion'

/**
 * The site-wide FAQ.
 *
 * A single, flat list — grouped headings, per-category pages and a search box are
 * all plausible next steps, but only once there are enough questions to justify
 * them. Four questions is not enough, so `/faq` is one honest list and the
 * contact and rent pages link into it.
 *
 * This file is the only home for FAQ copy. The rent page's renting questions and
 * the contact page's "how do I reach you" questions are drawn from the same
 * feature rather than being retyped per page, which is what stops the two from
 * drifting into different answers to the same question.
 */
export const faqItems: FaqItem[] = [
  {
    id: 'faq-how-to-contact',
    question: 'How do I get in touch with Novera Estates?',
    answer:
      'Call the office, send the enquiry form on the contact page, message us on WhatsApp or email us directly — whichever is easiest. Every channel reaches the same team, and we answer within one working day.',
  },
  {
    id: 'faq-response-time',
    question: 'How quickly will I hear back?',
    answer:
      'Within one working day for enquiries made during office hours. Anything urgent — a viewing today, a property about to be taken — is best raised by phone.',
  },
  {
    id: 'faq-inspection',
    question: 'Can I inspect a property before deciding?',
    answer:
      'Yes, and we encourage it. Tell us which property or area you are interested in and we will arrange a viewing, either at the property or at our office. Inspections are free and carry no obligation.',
  },
  {
    id: 'faq-renting',
    question: 'How do I find a property to rent?',
    answer:
      'Use the search on the Rent page to filter by location, property type, budget and bedrooms. Submitting the search opens the catalogue with those filters applied, so you can compare every matching rental in one place.',
  },
  {
    id: 'faq-renting-costs',
    question: 'What costs should I consider when renting?',
    answer:
      'Consider the rent itself together with any applicable additional charges — service charges, agency or legal fees, and a security deposit. Ask for the full breakdown in writing before you commit.',
  },
  {
    id: 'faq-save-properties',
    question: 'Can I save properties?',
    answer:
      'You can save properties as you browse using the heart on each card. A customer account that keeps your shortlist across visits is on the way — in the meantime your saved set lasts for the current session.',
  },
  {
    id: 'faq-list-property',
    question: 'Can I list a property with you?',
    answer:
      'Yes. Use the contact form and choose "Sell / List a Property", or ask for a valuation. We will discuss pricing, marketing and the paperwork, and you can decide whether to go ahead at any point.',
  },
  {
    id: 'faq-areas',
    question: 'Which parts of Lagos do you cover?',
    answer:
      'Lekki, Ikoyi, Victoria Island, Ikeja, Ajah and Yaba, with more areas added as we grow. Each area has its own page describing what it offers and the properties we hold there.',
  },
  {
    id: 'faq-demo-data',
    question: 'Is this website live?',
    answer:
      'Not yet. Every listing, price and count on this site is sample data, so the layout, search and filters are all real but nothing is a real offer. The office details are genuine, and the team is ready to talk.',
  },
]
