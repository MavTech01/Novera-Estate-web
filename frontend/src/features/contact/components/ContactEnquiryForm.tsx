import { useMemo } from 'react'

import { company } from '@/data/company'
import {
  contactEnquiryWhatsAppMessage,
  defaultSubjectFor,
  enquiryTypeLabel,
  enquiryTypes,
} from '@/features/contact/data/contactData'
import { useContactEnquiry } from '@/features/contact/hooks/useContactEnquiry'
import { Button, ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextArea } from '@/shared/components/ui/TextArea'
import { TextField } from '@/shared/components/ui/TextField'
import { buildWhatsAppUrl } from '@/shared/lib/contactLinks'
import type { ContactEnquiry, EnquiryType } from '@/features/contact/types/contact.types'

interface ContactEnquiryFormProps {
  /** Seeded from `/contact?type=…`, so the header's CTA arrives pre-selected. */
  initialType?: EnquiryType | null
}

const typeOptions = enquiryTypes.map((type) => ({ value: type.value, label: type.label }))

/**
 * The enquiry form.
 *
 * Honest about what it does: there is no backend in this phase, so submitting
 * goes through `contactService`, which stands in for `POST /api/contact`. The
 * success state therefore quotes a reference from that call and says plainly that
 * the message is sitting in a demo queue — it never claims an inbox delivered a
 * reply that no one will read. The WhatsApp button beside it is the real, working
 * route to a person, carrying exactly what the visitor typed.
 *
 * Validation lives in `contactForm` and is shared with the eventual API shape, so
 * nothing about the form is thrown away when the server arrives.
 */
export function ContactEnquiryForm({ initialType = null }: ContactEnquiryFormProps) {
  const {
    values,
    errors,
    phase,
    isSubmitting,
    receipt,
    submitted,
    failure,
    update,
    submit,
    reset,
    retry,
  } = useContactEnquiry(initialType)

  const options = useMemo(() => typeOptions, [])

  /** Choosing a type fills the subject, unless the visitor has written their own. */
  const handleTypeChange = (value: string) => {
    const enquiryType = value as EnquiryType
    update('enquiryType', enquiryType)
    if (!values.subject.trim()) update('subject', defaultSubjectFor(enquiryType))
  }

  if (phase === 'submitted' && submitted && receipt) {
    return (
      <ContactEnquirySuccess
        submitted={submitted}
        reference={receipt.reference}
        respondedBy={receipt.respondedBy}
        onReset={reset}
      />
    )
  }

  return (
    <Section tone="white" ariaLabelledBy="contact-form-heading">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Why write to us, and what happens next. */}
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Send us a message"
              title="Tell Us What You're Looking For"
              description="The more you tell us — location, budget, timeline — the more useful our first reply can be. We answer every enquiry within one working day."
              align="left"
            />

            <ul className="mt-8 space-y-4">
              {[
                'A named consultant, not a shared inbox',
                'Shortlists built around your actual budget',
                'Straight answers when a property is not right for you',
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
                This form is running in demonstration mode, so nothing is emailed to a real inbox
                yet. Submitting shows you exactly what happens — and gives you a WhatsApp message
                you can send us right now.
              </span>
            </p>
          </Reveal>

          {/* The form itself. */}
          <Reveal delay={120} className="lg:col-span-8">
            <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                  void submit()
                }}
                noValidate
                className="flex flex-col gap-5"
                aria-busy={isSubmitting}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField
                    id="contact-fullName"
                    label="Full Name"
                    value={values.fullName}
                    onChange={(value) => update('fullName', value)}
                    placeholder="e.g. Ada Obi"
                    icon="users"
                    autoComplete="name"
                    required
                    disabled={isSubmitting}
                    error={errors.fullName}
                  />

                  <TextField
                    id="contact-phone"
                    label="Phone Number (optional)"
                    value={values.phone}
                    onChange={(value) => update('phone', value)}
                    placeholder="e.g. 0803 000 0000"
                    type="tel"
                    icon="phone"
                    autoComplete="tel"
                    disabled={isSubmitting}
                    error={errors.phone}
                  />
                </div>

                <TextField
                  id="contact-email"
                  label="Email Address"
                  value={values.email}
                  onChange={(value) => update('email', value)}
                  placeholder="you@example.com"
                  type="email"
                  icon="mail"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  error={errors.email}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <SelectField
                    id="contact-enquiryType"
                    label="Enquiry Type"
                    value={values.enquiryType}
                    options={options}
                    onChange={handleTypeChange}
                    className={isSubmitting ? 'pointer-events-none opacity-60' : undefined}
                  />

                  <TextField
                    id="contact-subject"
                    label="Subject (optional)"
                    value={values.subject}
                    onChange={(value) => update('subject', value)}
                    placeholder="e.g. Two-bedroom rental in Lekki"
                    icon={null}
                    disabled={isSubmitting}
                    error={errors.subject}
                  />
                </div>

                <TextArea
                  id="contact-message"
                  label="Message"
                  value={values.message}
                  onChange={(value) => update('message', value)}
                  placeholder="Tell us the area you are looking in, your budget, and when you would like to move."
                  rows={6}
                  required
                  disabled={isSubmitting}
                  error={errors.message}
                />

                {failure && (
                  <p role="alert" className="flex items-start gap-2 rounded-md border border-accent-200 bg-tint-50 px-4 py-3 text-sm font-medium text-accent-700">
                    <Icon name="triangle-alert" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                    {failure}
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button type="submit" size="lg" withArrow disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                  </Button>

                  {phase === 'error' && (
                    <Button type="button" variant="outline" size="lg" onClick={retry}>
                      <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
                      Try Again
                    </Button>
                  )}

                  {/* The button's own label changes, which a screen reader may miss. */}
                  <span aria-live="polite" className="sr-only">
                    {isSubmitting ? 'Sending your enquiry, please wait.' : ''}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-ink-400">
                  By sending this enquiry you agree to be contacted about it. {company.name} does not
                  sell or share your details, and you can ask us to delete your message at any time.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}

interface ContactEnquirySuccessProps {
  submitted: ContactEnquiry
  reference: string
  respondedBy: string
  onReset: () => void
}

/**
 * Confirmation state.
 *
 * It states what is true — the enquiry was accepted by the demo service, under
 * this reference — and then makes the WhatsApp hand-off one tap away. The visitor
 * can send their own words rather than being told a reply is already on its way.
 */
function ContactEnquirySuccess({
  submitted,
  reference,
  respondedBy,
  onReset,
}: ContactEnquirySuccessProps) {
  return (
    <Section tone="white" ariaLabelledBy="contact-form-heading">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-4">
            <SectionHeading
              eyebrow="Send us a message"
              title="Tell Us What You're Looking For"
              description="The more you tell us — location, budget, timeline — the more useful our first reply can be."
              align="left"
            />
          </Reveal>

          <Reveal delay={120} className="lg:col-span-8">
            <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="text-center" role="status">
                <span className="mx-auto flex size-16 items-center justify-center rounded-pill bg-success-100 text-success-600">
                  <Icon name="check-circle" className="size-8" strokeWidth={1.75} />
                </span>

                <h3 className="mt-5 font-display text-xl text-ink-900">
                  Thanks, {submitted.fullName.split(' ')[0]} — your enquiry is in
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                  We've recorded it as{' '}
                  <span className="font-semibold text-ink-900">{reference}</span> and our team
                  replies within one working day, by {respondedBy}.
                </p>
              </div>

              <dl className="mx-auto mt-6 max-w-md rounded-md border border-sand-200 bg-sand-100 p-4 text-left">
                {[
                  { id: 'type', label: 'Enquiry type', value: enquiryTypeLabel(submitted.enquiryType) },
                  { id: 'subject', label: 'Subject', value: submitted.subject },
                  { id: 'email', label: 'Email', value: submitted.email },
                ].map((row) => (
                  <div key={row.id} className="flex justify-between gap-4 py-1.5 text-sm last:pb-0">
                    <dt className="text-ink-400">{row.label}</dt>
                    <dd className="text-right font-semibold text-ink-900">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-ink-400">
                This site is running in demonstration mode, so no email has actually left the
                browser. Sending the message below reaches us for real.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <ButtonLink
                  href={buildWhatsAppUrl(company.phone, contactEnquiryWhatsAppMessage(submitted))}
                  variant="accent"
                  size="lg"
                  withArrow
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Send on WhatsApp
                </ButtonLink>

                <Button type="button" variant="outline" size="lg" onClick={onReset}>
                  Send another message
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
