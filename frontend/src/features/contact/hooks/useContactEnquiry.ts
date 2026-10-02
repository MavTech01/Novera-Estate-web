import { useCallback, useState } from 'react'

import {
  createEmptyContactEnquiry,
  defaultSubjectFor,
  parseEnquiryType,
} from '@/features/contact/data/contactData'
import { submitContactEnquiry } from '@/features/contact/services/contactService'
import {
  toContactEnquiryPayload,
  validateContactEnquiry,
} from '@/features/contact/utils/contactForm'
import type {
  ContactEnquiry,
  ContactEnquiryErrors,
  EnquiryType,
} from '@/features/contact/types/contact.types'
import type { ContactEnquiryReceipt } from '@/features/contact/types/contact.types'

export type ContactEnquiryPhase = 'editing' | 'submitting' | 'submitted' | 'error'

export interface ContactEnquiryController {
  values: ContactEnquiry
  errors: ContactEnquiryErrors
  phase: ContactEnquiryPhase
  isSubmitting: boolean
  /** The receipt, once the submission succeeded. */
  receipt: ContactEnquiryReceipt | null
  /** The trimmed enquiry as it was sent, echoed back in the success state. */
  submitted: ContactEnquiry | null
  /** Message for the `error` phase; retry is available. */
  failure: string | null
  update: <K extends keyof ContactEnquiry>(key: K, value: ContactEnquiry[K]) => void
  submit: () => Promise<void>
  /** Clears the form back to its initial state. */
  reset: () => void
  /** Re-sends after a failed submission, keeping what was typed. */
  retry: () => void
}

/**
 * The contact form's state machine.
 *
 * Four phases rather than a `loading` boolean, because the difference between
 * "sending", "sent" and "failed" is exactly what the visitor needs to be told:
 *
 *  - `editing` — the form, with per-field errors after a failed validation.
 *  - `submitting` — the button is disabled and says so; fields are locked.
 *  - `submitted` — the receipt is on screen. Nothing is editable, so an enquiry
 *    cannot be half-edited behind a success message.
 *  - `error` — the transport failed. The typed values are kept and the visitor
 *    can try again, because losing their message to a network hiccup is the
 *    worst thing this page could do.
 *
 * The enquiry type is seeded from the URL by the page, which is how the header's
 * "Book an Inspection" CTA arrives with `inspection` already selected.
 */
export function useContactEnquiry(initialType?: EnquiryType | null): ContactEnquiryController {
  const [values, setValues] = useState<ContactEnquiry>(() =>
    createEmptyContactEnquiry(initialType ?? 'general'),
  )
  const [errors, setErrors] = useState<ContactEnquiryErrors>({})
  const [phase, setPhase] = useState<ContactEnquiryPhase>('editing')
  const [receipt, setReceipt] = useState<ContactEnquiryReceipt | null>(null)
  const [submitted, setSubmitted] = useState<ContactEnquiry | null>(null)
  const [failure, setFailure] = useState<string | null>(null)

  const update = useCallback(<K extends keyof ContactEnquiry>(key: K, value: ContactEnquiry[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    // Clear this field's error as soon as it is touched: leaving a message under
    // a field the visitor has just corrected reads as though nothing happened.
    setErrors((current) => ({ ...current, [key]: undefined }))
  }, [])

  const send = useCallback(async (candidate: ContactEnquiry) => {
    setPhase('submitting')
    setFailure(null)

    try {
      const payload = toContactEnquiryPayload(candidate)
      const result = await submitContactEnquiry(payload)

      setReceipt(result)
      setSubmitted(payload)
      setPhase('submitted')
    } catch {
      setFailure(
        'We could not send your enquiry just now. Your message is still here — please try again, or call the office.',
      )
      setPhase('error')
    }
  }, [])

  const submit = useCallback(async () => {
    const nextErrors = validateContactEnquiry(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      // Send focus to the first problem rather than leaving the visitor to hunt.
      const firstField = Object.keys(nextErrors)[0]
      document.getElementById(`contact-${firstField}`)?.focus()
      return
    }

    await send(values)
  }, [values, send])

  const reset = useCallback(() => {
    setValues(createEmptyContactEnquiry())
    setErrors({})
    setReceipt(null)
    setSubmitted(null)
    setFailure(null)
    setPhase('editing')
  }, [])

  const retry = useCallback(() => {
    void send(values)
  }, [values, send])

  return {
    values,
    errors,
    phase,
    isSubmitting: phase === 'submitting',
    receipt,
    submitted,
    failure,
    update,
    submit,
    reset,
    retry,
  }
}

/** The enquiry type a URL asks for, or `null`. */
export function enquiryTypeFromQuery(raw: string | null): EnquiryType | null {
  return parseEnquiryType(raw)
}

/** Re-exported so the form can seed a subject when the type changes. */
export { defaultSubjectFor }
