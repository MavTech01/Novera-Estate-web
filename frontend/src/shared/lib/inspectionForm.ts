import type { InspectionRequest, InspectionRequestPayload, PropertyDetail } from '@/types'

/**
 * Inspection request form: defaults, options, validation and payload shape.
 *
 * Kept apart from the component so the same rules can be reused by the contact
 * page later, and so the eventual `POST /api/inspections` body is defined in one
 * place instead of being assembled inside JSX.
 */

/** Time windows a visitor can pick, roughly matching the agency's office hours. */
export const inspectionTimeOptions = [
  { value: 'morning', label: 'Morning (9:00am – 12:00pm)' },
  { value: 'afternoon', label: 'Afternoon (12:00pm – 3:00pm)' },
  { value: 'evening', label: 'Evening (3:00pm – 6:00pm)' },
]

export function createEmptyInspectionRequest(): InspectionRequest {
  return { fullName: '', phone: '', email: '', preferredDate: '', preferredTime: '', message: '' }
}

/** Tomorrow, as `YYYY-MM-DD`. Inspections cannot be booked for today. */
export function getEarliestInspectionDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toISOString().slice(0, 10)
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Accepts local and international formats, with the usual separators. */
const phonePattern = /^[+()\d][\d\s()+-]{6,}$/

export type InspectionErrors = Partial<Record<keyof InspectionRequest, string>>

/**
 * Client-side validation for the required fields.
 * Returns an empty object when the request is ready to send.
 */
export function validateInspectionRequest(values: InspectionRequest): InspectionErrors {
  const errors: InspectionErrors = {}

  if (values.fullName.trim().length < 2) errors.fullName = 'Please enter your full name.'
  if (!phonePattern.test(values.phone.trim())) errors.phone = 'Please enter a valid phone number.'
  if (!emailPattern.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!values.preferredDate) errors.preferredDate = 'Choose a preferred date.'
  if (!values.preferredTime) errors.preferredTime = 'Choose a preferred time.'

  return errors
}

/** Shapes the form values into the request the API will accept. */
export function toInspectionPayload(
  values: InspectionRequest,
  property: Pick<PropertyDetail, 'id' | 'slug' | 'title'>,
): InspectionRequestPayload {
  return {
    ...values,
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
    propertyId: property.id,
    propertySlug: property.slug,
    propertyTitle: property.title,
  }
}
