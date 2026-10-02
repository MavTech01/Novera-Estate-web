import type { ContactEnquiryPayload, ContactEnquiryReceipt } from '@/features/contact/types/contact.types'
import { RESPONSE_WINDOW_DAYS } from '@/features/contact/data/contactData'

/**
 * Contact enquiry submission.
 *
 * The single seam for the contact form, in the same position as
 * `inspectionRepository`: the component above it is written against *this*
 * signature, so wiring a real `POST /api/contact` behind it changes one file and
 * nothing else.
 *
 * The delay is deliberate. A form that responds in the same tick a visitor clicks
 * is a form that looks fake, and the submitting state is part of what this page
 * has to get right.
 */
const MOCK_LATENCY_MS = 600

function createReference(): string {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `NEQ-${suffix}`
}

/** Today plus the response window, as an ISO date. */
function respondedByDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + RESPONSE_WINDOW_DAYS)
  return date.toISOString().slice(0, 10)
}

export async function submitContactEnquiry(
  payload: ContactEnquiryPayload,
): Promise<ContactEnquiryReceipt> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS))

  return {
    reference: createReference(),
    enquiryType: payload.enquiryType,
    respondedBy: respondedByDate(),
  }
}
