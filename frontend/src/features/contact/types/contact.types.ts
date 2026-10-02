import type { IconName } from '@/types'

/**
 * Domain models for the Contact feature.
 *
 * The page is a way to reach the agency, not a data-rich catalogue, so there is
 * no listing model here. It needs exactly three things:
 *
 *   POST /api/contact          → the enquiry itself
 *   GET  /api/contact/info     → office, phone, email, hours, map position
 *   GET  /api/contact/faq      → the questions worth answering up front
 *
 * The enquiry payload below is the shape that endpoint will accept, which is why
 * `EnquiryType` is a closed union rather than a free-text field: it becomes an
 * enum the server can route on, and the same enum seeds the form from
 * `/contact?type=inspection` so a nav CTA lands on a pre-selected subject.
 */

/**
 * What an enquiry is about.
 *
 * The first member is the empty state, so a freshly mounted form has something
 * selected and the visitor is never looking at a blank control.
 */
export type EnquiryType =
  | 'general'
  | 'buy'
  | 'rent'
  | 'inspection'
  | 'sell'
  | 'valuation'
  | 'project'
  | 'other'

/** The form's values, one property per field. */
export interface ContactEnquiry {
  fullName: string
  email: string
  phone: string
  /** Optional: free-text subject line the visitor can override. */
  subject: string
  enquiryType: EnquiryType
  message: string
}

/**
 * The request body for `POST /api/contact`.
 *
 * Trimmed and validated on the client; the server re-validates and adds
 * `createdAt` and an assignment rule. Returning a reference from that call is
 * what lets the success state quote a real number instead of inventing one.
 */
export type ContactEnquiryPayload = ContactEnquiry

/** What a successful submission returns. */
export interface ContactEnquiryReceipt {
  /** Reference shown to the visitor, e.g. "NEQ-7C31F". */
  reference: string
  /** The enquiry type echoed back, resolved to its label. */
  enquiryType: EnquiryType
  /** When the agency committed to responding, as an ISO date. */
  respondedBy: string
}

/** One channel the visitor can reach the agency through. */
export interface ContactChannel {
  id: string
  label: string
  /** The value to read or dial — already human-formatted. */
  value: string
  icon: IconName
  /** `tel:`/`mailto:`/WhatsApp link, or `null` for the office address. */
  href: string | null
  /** How it behaves: a link, or the answer to "when can I reach you". */
  kind: 'link' | 'text'
  /** Extra line under the value, e.g. what the office hours cover. */
  note: string
}

/** One entry in the quick-action row above the form. */
export interface ContactQuickAction {
  id: string
  label: string
  description: string
  icon: IconName
  href: string
  /** External links open in a new tab; internal ones do not. */
  external: boolean
}

/** One question in the contact page's FAQ preview. */
export interface ContactFaqItem {
  id: string
  question: string
  answer: string
}

/** Validation output — an empty object means the enquiry is ready to send. */
export type ContactEnquiryErrors = Partial<Record<keyof ContactEnquiry, string>>
