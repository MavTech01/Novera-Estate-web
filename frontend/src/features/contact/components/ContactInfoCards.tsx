import { company } from '@/data/company'
import { contactChannels } from '@/features/contact/data/contactData'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'

/**
 * "We're Here to Help" — direct contact channels for immediate assistance,
 * WhatsApp messaging, email documentation, and our Lagos office.
 *
 * Designed with modern luxury card architecture, clear visual hierarchy,
 * interactive hover/touch feedback, and responsive layout for mobile and desktop.
 */
export function ContactInfoCards() {
  return (
    <Section tone="tint" ariaLabelledBy="contact-info-heading">
      <Container>
        <SectionHeading
          id="contact-info-heading"
          eyebrow="Talk to us"
          title="We're Here to Help"
          description={`However you prefer to reach us, you'll connect with a dedicated Lagos advisor who knows the properties and neighbourhoods inside out. ${company.hours}.`}
          align="center"
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {contactChannels.map((channel, index) => {
            const isEmerald = channel.badgeTone === 'emerald'
            const isAccent = channel.badgeTone === 'accent'

            const cardContent = (
              <div className="flex h-full flex-col justify-between">
                <div>
                  {/* Top Bar: Icon + Status Pill */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-sand-200/80 bg-tint-100/90 text-accent-700 shadow-xs transition-colors duration-300 group-hover:border-accent-700 group-hover:bg-accent-700 group-hover:text-white">
                      <Icon name={channel.icon} className="size-5" strokeWidth={2} />
                    </span>

                    {channel.badge && (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-tight ${
                          isEmerald
                            ? 'bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/25'
                            : isAccent
                              ? 'bg-accent-50 text-accent-900 ring-1 ring-inset ring-accent-600/25'
                              : 'bg-sand-100/90 text-ink-600 ring-1 ring-inset ring-sand-300/60'
                        }`}
                      >
                        {isEmerald && (
                          <span className="relative flex size-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                          </span>
                        )}
                        {channel.badge}
                      </span>
                    )}
                  </div>

                  {/* Category Eyebrow */}
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                    {channel.label}
                  </p>

                  {/* Primary Value */}
                  <h3 className="mt-1 font-display text-lg font-bold leading-snug text-ink-950 transition-colors duration-200 group-hover:text-accent-700 sm:text-xl">
                    {channel.value}
                  </h3>

                  {/* Context Note */}
                  <p className="mt-2 text-xs leading-relaxed text-ink-500 sm:text-sm">
                    {channel.note}
                  </p>
                </div>

                {/* Bottom Action Pill */}
                <div className="mt-6 flex items-center justify-between border-t border-sand-100 pt-4 text-xs font-semibold text-ink-900 transition-colors duration-200 group-hover:text-accent-700 sm:text-sm">
                  <span>{channel.actionLabel ?? 'Get in touch'}</span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-sand-100 text-ink-600 shadow-2xs transition-all duration-200 group-hover:translate-x-1 group-hover:bg-accent-700 group-hover:text-white">
                    <Icon name="arrow-right" className="size-3.5" strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            )

            const cardClasses =
              'group relative flex h-full w-full flex-col justify-between rounded-2xl border border-sand-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-accent-300 hover:shadow-lg hover:shadow-ink-950/5 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600'

            return (
              <Reveal key={channel.id} className="flex h-full" delay={index * 70}>
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={channel.external ? '_blank' : undefined}
                    rel={channel.external ? 'noopener noreferrer' : undefined}
                    className={cardClasses}
                  >
                    {cardContent}
                  </a>
                ) : (
                  <article className={cardClasses}>{cardContent}</article>
                )}
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
