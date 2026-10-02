import { company } from '@/data/company'
import { contactChannels } from '@/features/contact/data/contactData'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'

/**
 * "We're Here to Help" — the four ways to reach the office, and what each one is
 * best for.
 *
 * Every value comes from `company`, so these cards cannot disagree with the
 * header, the footer or a property card's agent details. The `note` under each one
 * is the part that actually helps someone choose: it says what the channel is for,
 * not just what it is.
 */
export function ContactInfoCards() {
  return (
    <Section tone="white" ariaLabelledBy="contact-info-heading">
      <Container>
        <SectionHeading
          id="contact-info-heading"
          eyebrow="Talk to us"
          title="We're Here to Help"
          description={`However you'd prefer to reach us, you'll speak to someone who knows the Lagos market and the properties on our books. ${company.hours}.`}
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactChannels.map((channel, index) => {
            const body = (
              <>
                <span className="flex size-12 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                  <Icon name={channel.icon} className="size-5" strokeWidth={2} />
                </span>

                <p className="mt-5 text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
                  {channel.label}
                </p>

                <p className="mt-2 font-display text-base leading-snug text-ink-900">
                  {channel.value}
                </p>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">{channel.note}</p>

                {channel.kind === 'link' && (
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700">
                    Get in touch
                    <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />
                  </span>
                )}
              </>
            )

            const card = (
              <article className="flex h-full w-full flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-sm transition-colors duration-300 hover:border-accent-300">
                {body}
              </article>
            )

            return (
              <Reveal key={channel.id} className="flex" delay={index * 80}>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
                  >
                    {card}
                  </a>
                ) : (
                  card
                )}
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
