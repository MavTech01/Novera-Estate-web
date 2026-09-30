import { useState } from 'react'

import {
  createEmptyInspectionRequest,
  getEarliestInspectionDate,
  inspectionTimeOptions,
  toInspectionPayload,
  validateInspectionRequest,
  type InspectionErrors,
} from '../../lib/inspectionForm'
import { cn } from '../../lib/cn'
import type { InspectionRequest, InspectionRequestPayload, PropertyDetail } from '../../types'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { SelectField } from '../ui/SelectField'
import { TextArea } from '../ui/TextArea'
import { TextField } from '../ui/TextField'

interface InspectionFormProps {
  property: PropertyDetail
  /** Receives the validated form values joined to the listing's identity. */
  onSubmit: (values: InspectionRequestPayload) => void
  isSubmitting?: boolean
  className?: string
}

/**
 * Inspection request fields.
 *
 * The property is shown as a read-only summary rather than a field — the
 * visitor opened this from a listing page, so asking them to confirm it would
 * be noise. All inputs are labelled, and errors are announced through
 * `role="alert"` and linked with `aria-describedby`.
 */
export function InspectionForm({ property, onSubmit, isSubmitting = false, className }: InspectionFormProps) {
  const [values, setValues] = useState<InspectionRequest>(createEmptyInspectionRequest)
  const [errors, setErrors] = useState<InspectionErrors>({})

  const update = <K extends keyof InspectionRequest>(key: K, value: InspectionRequest[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateInspectionRequest(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    onSubmit(toInspectionPayload(values, property))
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('flex flex-col gap-5', className)}>
      {/* The listing being requested, stated rather than asked for. */}
      <div className="rounded-md border border-accent-200 bg-tint-50 p-4">
        <p className="text-[length:var(--text-label)] uppercase leading-4 text-accent-700">Property</p>
        <p className="mt-1.5 font-display text-base leading-snug text-ink-900">{property.title}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
          <Icon name="map-pin" className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
          {property.location.label}
        </p>
      </div>

      <TextField
        id="inspection-full-name"
        label="Full Name"
        value={values.fullName}
        onChange={(value) => update('fullName', value)}
        placeholder="e.g. Ada Obi"
        icon="users"
        autoComplete="name"
        required
        error={errors.fullName}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          id="inspection-phone"
          label="Phone Number"
          type="tel"
          value={values.phone}
          onChange={(value) => update('phone', value)}
          placeholder="+234 800 000 0000"
          icon="phone"
          autoComplete="tel"
          required
          error={errors.phone}
        />

        <TextField
          id="inspection-email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(value) => update('email', value)}
          placeholder="you@example.com"
          icon="mail"
          autoComplete="email"
          required
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          id="inspection-date"
          label="Preferred Date"
          type="date"
          min={getEarliestInspectionDate()}
          value={values.preferredDate}
          onChange={(value) => update('preferredDate', value)}
          icon="calendar"
          required
          error={errors.preferredDate}
        />

        <SelectField
          id="inspection-time"
          label="Preferred Time"
          value={values.preferredTime}
          options={inspectionTimeOptions}
          onChange={(value) => update('preferredTime', value)}
          placeholder="Select a time"
        />
        {errors.preferredTime && (
          <p role="alert" className="-mt-3 text-xs font-medium text-accent-700 sm:col-span-2">
            {errors.preferredTime}
          </p>
        )}
      </div>

      <TextArea
        id="inspection-message"
        label="Message"
        value={values.message}
        onChange={(value) => update('message', value)}
        placeholder="Anything we should know before the visit, e.g. questions about documents or move-in timelines."
        icon="message"
        rows={4}
      />

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending Request…' : 'Request Inspection'}
        {!isSubmitting && <Icon name="send" className="size-4" strokeWidth={2} />}
      </Button>

      <p className="text-center text-xs leading-relaxed text-ink-400">
        This demo form does not submit anywhere yet — no data is sent or stored.
      </p>
    </form>
  )
}
