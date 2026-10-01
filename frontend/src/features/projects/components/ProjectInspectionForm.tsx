import { useState } from 'react'

import { Button, ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextArea } from '@/shared/components/ui/TextArea'
import { TextField } from '@/shared/components/ui/TextField'
import { cn } from '@/shared/lib/cn'
import {
  createEmptyInspectionRequest,
  getEarliestInspectionDate,
  inspectionTimeOptions,
  validateInspectionRequest,
  type InspectionErrors,
} from '@/shared/lib/inspectionForm'
import type { InspectionRequest } from '@/types'
import type { Project } from '@/features/projects/types/projectTypes'
import { projectInspectionWhatsAppHref } from '@/features/projects/utils/projectContact'

interface ProjectInspectionFormProps {
  project: Project
}

/**
 * "Book an Inspection" — an in-page enquiry form, not a route.
 *
 * There is no backend in this phase, so the form validates locally and then
 * offers the visitor a WhatsApp message containing exactly what they typed.
 * That keeps the form honest — it does not claim to have sent anything it could
 * not send — while giving the visitor a real next step.
 *
 * Validation is the shared `inspectionForm` rules, so this behaves the same way
 * as the property inspection form.
 */
export function ProjectInspectionForm({ project }: ProjectInspectionFormProps) {
  const [values, setValues] = useState<InspectionRequest>(createEmptyInspectionRequest)
  const [errors, setErrors] = useState<InspectionErrors>({})
  const [submittedDetails, setSubmittedDetails] = useState<InspectionRequest | null>(null)

  const update = <K extends keyof InspectionRequest>(key: K, value: InspectionRequest[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateInspectionRequest(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      // Send focus to the first problem rather than leaving the visitor to hunt.
      const firstField = Object.keys(nextErrors)[0]
      document.getElementById(`inspection-${firstField}`)?.focus()
      return
    }

    const trimmed: InspectionRequest = {
      ...values,
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    }

    setSubmittedDetails(trimmed)
  }

  const handleReset = () => {
    setValues(createEmptyInspectionRequest())
    setErrors({})
    setSubmittedDetails(null)
  }

  return (
    <Section tone="white">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Why inspect, and what happens next. */}
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="See it for yourself"
              title="Book an Inspection"
              description="Visit the site with a Novera consultant and walk through the unit type you are considering."
              align="left"
            />

            <ul className="mt-8 space-y-4">
              {[
                'Tour the site and the show unit, where one exists',
                'Discuss payment plans and documentation directly',
                'No obligation — take the time you need to decide',
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-ink-600">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill bg-success-100 text-success-600">
                    <Icon name="check" className="size-3.5" strokeWidth={2.5} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-start gap-2.5 rounded-md border border-sand-200 bg-tint-50 px-4 py-3 text-xs leading-relaxed text-ink-500">
              <Icon name="triangle-alert" className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
              <span>
                This form is not connected to a booking system yet. Submitting it prepares a WhatsApp message
                with your details for you to send.
              </span>
            </p>
          </Reveal>

          {/* The form itself. */}
          <Reveal delay={120} className="lg:col-span-7">
            <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
              {submittedDetails ? (
                <InspectionSuccess
                  project={project}
                  details={submittedDetails}
                  onReset={handleReset}
                />
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* The project is pre-selected by the page, so it is stated, not asked. */}
                  <div className="rounded-md border border-accent-200 bg-tint-50 p-4">
                    <p className="text-[length:var(--text-label)] uppercase leading-4 text-accent-700">
                      Project
                    </p>
                    <p className="mt-1.5 font-display text-base leading-snug text-ink-900">{project.name}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                      <Icon name="map-pin" className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
                      {project.location}
                    </p>
                  </div>

                  <TextField
                    id="inspection-fullName"
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
                      value={values.phone}
                      onChange={(value) => update('phone', value)}
                      placeholder="e.g. 0803 000 0000"
                      type="tel"
                      icon="phone"
                      autoComplete="tel"
                      required
                      error={errors.phone}
                    />

                    <TextField
                      id="inspection-email"
                      label="Email Address"
                      value={values.email}
                      onChange={(value) => update('email', value)}
                      placeholder="you@example.com"
                      type="email"
                      icon="mail"
                      autoComplete="email"
                      required
                      error={errors.email}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <TextField
                      id="inspection-preferredDate"
                      label="Preferred Date"
                      value={values.preferredDate}
                      onChange={(value) => update('preferredDate', value)}
                      type="date"
                      icon="calendar"
                      min={getEarliestInspectionDate()}
                      required
                      error={errors.preferredDate}
                    />

                    <SelectField
                      id="inspection-preferredTime"
                      label="Preferred Time"
                      value={values.preferredTime}
                      onChange={(value) => update('preferredTime', value)}
                      options={inspectionTimeOptions}
                      placeholder="Select a time"
                    />
                  </div>

                  <TextArea
                    id="inspection-message"
                    label="Anything we should know? (optional)"
                    value={values.message}
                    onChange={(value) => update('message', value)}
                    placeholder="Unit type you are interested in, questions about payment plans…"
                    rows={4}
                    error={errors.message}
                  />

                  <Button type="submit" size="lg" withArrow className="w-full sm:w-auto sm:self-start">
                    Request Inspection
                  </Button>

                  <p className="text-xs leading-relaxed text-ink-400">
                    By requesting an inspection you agree to be contacted about this development. Novera
                    Estates does not sell or share your details.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

interface InspectionSuccessProps {
  project: Project
  details: InspectionRequest
  onReset: () => void
}

/**
 * Confirmation state.
 *
 * It says plainly that nothing was sent, then makes the prepared WhatsApp message
 * one tap away. The visitor can copy or amend it rather than being told a booking
 * exists when it does not.
 */
function InspectionSuccess({ project, details, onReset }: InspectionSuccessProps) {
  return (
    <div className="text-center" role="status">
      <span className="mx-auto flex size-16 items-center justify-center rounded-pill bg-success-100 text-success-600">
        <Icon name="check-circle" className="size-8" strokeWidth={1.75} />
      </span>

      <h3 className="mt-5 font-display text-xl text-ink-900">Your request is ready</h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
        We have prepared a WhatsApp message with your inspection request for{' '}
        <span className="font-semibold text-ink-900">{project.name}</span>. Send it to a consultant to
        arrange a date.
      </p>

      <dl className="mx-auto mt-6 max-w-md rounded-md border border-sand-200 bg-sand-100 p-4 text-left">
        {[
          { id: 'name', label: 'Name', value: details.fullName },
          { id: 'date', label: 'Preferred date', value: details.preferredDate },
          { id: 'time', label: 'Preferred time', value: details.preferredTime },
          { id: 'phone', label: 'Phone', value: details.phone },
        ].map((row) => (
          <div key={row.id} className="flex justify-between gap-4 py-1.5 text-sm last:pb-0">
            <dt className="text-ink-400">{row.label}</dt>
            <dd className="text-right font-semibold text-ink-900">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className={cn('mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center')}>
        <ButtonLink
          href={projectInspectionWhatsAppHref(project, details)}
          variant="accent"
          size="lg"
          withArrow
        >
          Send on WhatsApp
        </ButtonLink>

        <Button type="button" variant="outline" size="lg" onClick={onReset}>
          Edit request
        </Button>
      </div>
    </div>
  )
}
