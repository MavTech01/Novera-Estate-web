import { defaultSubjectFor } from '@/features/contact/data/contactData'
import type { ContactEnquiry, ContactEnquiryErrors } from '@/features/contact/types/contact.types'

/**
 * Contact enquiry form: validation and payload shaping.
 *
 * Mirrors the shared `inspectionForm` rules rather than inventing a second set of
 * patterns, so an email address that passes an inspection request passes here
 * too. Phone is deliberately *optional* on this form: the whole point of the
 * page is that some visitors would rather only leave a message.
 */

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Accepts local and international formats, with the usual separators. */
const phonePattern = /^[+()\d][\d\s()+-]{6,}$/

/** Below this, a "message" is too short to be a real enquiry. */
const MIN_MESSAGE_LENGTH = 20

/** Below this, a subject is a stray keystroke rather than a subject. */
const MIN_SUBJECT_LENGTH = 3

/**
 * Client-side validation.
 *
 * Each field is only reported once it has been touched in a way that suggests the
 * visitor meant to fill it in: required fields are checked outright, while the
 * optional ones are checked only when something has been typed. That way an empty
 * phone field is never shown as an error.
 */
export function validateContactEnquiry(values: ContactEnquiry): ContactEnquiryErrors {
  const errors: ContactEnquiryErrors = {}

  if (values.fullName.trim().length < 2) errors.fullName = 'Please enter your full name.'

  if (!emailPattern.test(values.email.trim())) errors.email = 'Please enter a valid email address.'

  const phone = values.phone.trim()
  if (phone && !phonePattern.test(phone)) errors.phone = 'Please enter a valid phone number.'

  const subject = values.subject.trim()
  if (subject && subject.length < MIN_SUBJECT_LENGTH) {
    errors.subject = 'A subject of at least 3 characters helps us route your enquiry.'
  }

  if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = 'Please tell us a little more — at least a sentence or two.'
  }

  return errors
}

/** Trims every field, so nothing is sent with stray whitespace. */
export function toContactEnquiryPayload(values: ContactEnquiry): ContactEnquiry {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    // An empty subject is filled from the enquiry type rather than sent blank —
    // the recipient reads a subject line, and "Rent a Property" is a better one
    // than a bare message.
    subject: values.subject.trim() || defaultSubjectFor(values.enquiryType),
    enquiryType: values.enquiryType,
    message: values.message.trim(),
  }
}
