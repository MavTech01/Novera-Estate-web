import { images } from '@/assets/images'
import { company } from '@/data/company'
import { buildCallUrl, buildWhatsAppUrl } from '@/shared/lib/contactLinks'
import type {
  ContactChannel,
  ContactEnquiry,
  ContactEnquiryReceipt,
  ContactFaqItem,
  ContactQuickAction,
  EnquiryType,
} from '@/features/contact/types/contact.types'

/**
 * The Contact page's editorial and static data.
 *
 * The office details are *not* written here — they are read from `company`, the
 * single source of truth that the header, footer and every property card already
 * use. Duplicating a phone number in a fourth place is how a page ends up
 * contradicting the rest of the site, so this file only decides how the details
 * are presented and what else the page offers.
 */

/** The hero photograph: the office's own neighbourhood. */
export const CONTACT_HERO_IMAGE = {
  src: images.locations.lekki,
  alt: 'A quiet residential street in Lekki Phase 1, where the Novera Estates office is located',
}

/** One business day, as a date string — the commitment the success state quotes. */
export const RESPONSE_WINDOW_DAYS = 1

/**
 * The default WhatsApp message.
 *
 * Kept generic: the pre-filled version used by the form is built in
 * `contactEnquiryWhatsAppMessage`, which can include what the visitor actually
 * typed.
 */
const WHATSAPP_DEFAULT_MESSAGE =
  `Hello ${company.name}, I would like to speak with someone about a property enquiry.`

/**
 * How each enquiry type is labelled, and what the pre-filled subject becomes.
 *
 * The label is user-facing copy and the slug is what travels in the URL and the
 * request body, so they are kept together rather than being two parallel lists
 * that can drift apart.
 */
export const enquiryTypes: readonly {
  value: EnquiryType
  label: string
  /** Seed for the subject field when this type is chosen. */
  subject: string
}[] = [
  { value: 'general', label: 'General Enquiry', subject: 'General enquiry' },
  { value: 'buy', label: 'Buy a Property', subject: 'Property purchase enquiry' },
  { value: 'rent', label: 'Rent a Property', subject: 'Property rental enquiry' },
  { value: 'inspection', label: 'Book an Inspection', subject: 'Inspection request' },
  { value: 'sell', label: 'Sell / List a Property', subject: 'Property listing enquiry' },
  { value: 'valuation', label: 'Property Valuation', subject: 'Property valuation request' },
  { value: 'project', label: 'Project Enquiry', subject: 'Development enquiry' },
  { value: 'other', label: 'Other', subject: 'General enquiry' },
]

/** The human label for an enquiry type. */
export function enquiryTypeLabel(value: EnquiryType): string {
  return enquiryTypes.find((type) => type.value === value)?.label ?? 'General Enquiry'
}

/**
 * Reads an enquiry type out of the URL.
 *
 * The navigation CTA is `/contact?type=inspection`, so someone tapping "Book an
 * Inspection" in the header should arrive with that already selected. An
 * unrecognised value falls back to `general` rather than leaving the select
 * blank, and a missing one leaves the form at its own default.
 */
export function parseEnquiryType(raw: string | null): EnquiryType | null {
  if (!raw) return null

  return enquiryTypes.some((type) => type.value === raw) ? (raw as EnquiryType) : null
}

/** The four contact channels shown as cards. */
export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'phone',
    label: 'Direct Line',
    value: company.phone,
    icon: 'phone',
    href: buildCallUrl(company.phone),
    kind: 'link',
    note: 'Speak directly with a senior property advisor during office hours.',
    badge: 'Fastest response',
    badgeTone: 'emerald',
    actionLabel: 'Call Now',
    external: false,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Chat',
    value: 'Chat with an Advisor',
    icon: 'message',
    href: buildWhatsAppUrl(company.phone, WHATSAPP_DEFAULT_MESSAGE),
    kind: 'link',
    note: 'Instant messaging for quick questions, photos & viewing requests.',
    badge: 'Instant replies',
    badgeTone: 'accent',
    actionLabel: 'Open WhatsApp',
    external: true,
  },
  {
    id: 'email',
    label: 'Email Desk',
    value: company.email,
    icon: 'mail',
    href: `mailto:${company.emailHref}`,
    kind: 'link',
    note: 'Send property briefs, acquisition requests, or formal documentation.',
    badge: 'Within 24 hours',
    badgeTone: 'sand',
    actionLabel: 'Send an Email',
    external: false,
  },
  {
    id: 'office',
    label: 'Lagos Office',
    value: `${company.address.line1}, ${company.address.line2.trim()}`,
    icon: 'map-pin',
    href: '#contact-map',
    kind: 'link',
    note: `${company.hours}. Consultations and visits by appointment.`,
    badge: 'Advisory Suite',
    badgeTone: 'sand',
    actionLabel: 'View Location',
    external: false,
  },
]

/** Quick actions above the form — the four things people actually want to do. */
export const contactQuickActions: readonly ContactQuickAction[] = [
  {
    id: 'call',
    label: 'Call Us',
    description: 'Speak to a consultant now',
    icon: 'phone',
    href: buildCallUrl(company.phone),
    external: false,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    description: 'Message us in a few taps',
    icon: 'message',
    href: buildWhatsAppUrl(company.phone, WHATSAPP_DEFAULT_MESSAGE),
    external: true,
  },
  {
    id: 'email',
    label: 'Email Us',
    description: company.email,
    icon: 'mail',
    href: `mailto:${company.emailHref}`,
    external: false,
  },
]

/**
 * The four questions worth answering before the visitor writes anything.
 *
 * Deliberately the *contact* questions — how we respond, what happens next, what
 * an inspection involves — rather than a second copy of the renting FAQ. The
 * full list lives on `/faq`.
 */
export const contactFaq: readonly ContactFaqItem[] = [
  {
    id: 'faq-contact-response',
    question: 'How quickly will I hear back?',
    answer:
      'We answer every enquiry within one working day. Urgent requests — a viewing today, a property about to be taken — are worth a phone call, because that is faster than any form.',
  },
  {
    id: 'faq-contact-what-next',
    question: 'What happens after I get in touch?',
    answer:
      'A consultant picks up your enquiry, asks about the location, budget and timeline you had in mind, and comes back with the listings that fit — along with what is missing from the market, so you know both sides.',
  },
  {
    id: 'faq-contact-inspection',
    question: 'Can I inspect a property?',
    answer:
      'Yes, and we encourage it. Tell us which property or area you are interested in and we will arrange a viewing, either at the property or at our office. Inspections are free and carry no obligation.',
  },
  {
    id: 'faq-contact-no-commitment',
    question: 'Am I committed to anything by enquiring?',
    answer:
      'No. An enquiry is a conversation, not a transaction. Nothing on this site or in a viewing commits you to buy, rent or list, and we will say so plainly if a property is not right for you.',
  },
]

/** An empty form, optionally with an enquiry type already chosen. */
export function createEmptyContactEnquiry(enquiryType: EnquiryType = 'general'): ContactEnquiry {
  return { fullName: '', email: '', phone: '', subject: '', enquiryType, message: '' }
}

/** The subject line that matches a chosen enquiry type. */
export function defaultSubjectFor(enquiryType: EnquiryType): string {
  return enquiryTypes.find((type) => type.value === enquiryType)?.subject ?? 'General enquiry'
}

/** What the success state echoes back, trimmed and labelled. */
export interface SubmittedEnquiry {
  enquiry: ContactEnquiry
  receipt: ContactEnquiryReceipt
}

/**
 * A WhatsApp message built from what the visitor typed.
 *
 * Used by the form's success state and the quick-action row, so the hand-off
 * carries their own words rather than a generic greeting.
 */
export function contactEnquiryWhatsAppMessage(enquiry: ContactEnquiry): string {
  const lines = [
    `Hello ${company.name}, I would like to make an enquiry.`,
    '',
    `Name: ${enquiry.fullName}`,
    `Enquiry type: ${enquiryTypeLabel(enquiry.enquiryType)}`,
    enquiry.subject ? `Subject: ${enquiry.subject}` : '',
    enquiry.phone ? `Phone: ${enquiry.phone}` : '',
    enquiry.email ? `Email: ${enquiry.email}` : '',
    '',
    enquiry.message,
  ]

  return lines.filter(Boolean).join('\n')
}
