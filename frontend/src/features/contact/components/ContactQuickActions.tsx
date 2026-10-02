import { contactQuickActions } from '@/features/contact/data/contactData'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { routes } from '@/shared/lib/routes'
import type { ContactQuickAction } from '@/features/contact/types/contact.types'

interface ContactQuickActionsProps {
  /** The fourth action routes to the inspection page rather than leaving the site. */
  items?: readonly ContactQuickAction[]
}

/**
 * The four things people actually want to do when they land here: call, message,
 * email, or book a viewing. Placed between the contact details and the form
 * because someone with a question in hand should not have to fill in a form to
 * start a conversation.
 */
export function ContactQuickActions({ items }: ContactQuickActionsProps) {
  const actions: ContactQuickAction[] = [
    ...(items ?? contactQuickActions),
    {
      id: 'inspection',
      label: 'Book an Inspection',
      description: 'Arrange a viewing time',
      icon: 'calendar-search',
      href: routes.bookInspection,
      external: false,
    },
  ]

  return (
    <Section tone="tint" spacing="tight" ariaLabelledBy="contact-quick-actions-heading">
      <Container>
        <h2
          id="contact-quick-actions-heading"
          className="text-center text-[length:clamp(1.5rem,2.4vw,2rem)] font-bold text-ink-900"
        >
          Rather just talk to someone?
        </h2>

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action, index) => (
            <Reveal key={action.id} className="flex" delay={index * 70}>
              <li className="flex w-full">
                <ButtonLink
                  href={action.href}
                  variant="outline"
                  size="lg"
                  withArrow
                  target={action.external ? '_blank' : undefined}
                  rel={action.external ? 'noopener noreferrer' : undefined}
                  className="h-auto w-full flex-col items-start gap-1 bg-white px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-2">
                    <Icon name={action.icon} className="size-4 shrink-0" strokeWidth={2} />
                    {action.label}
                  </span>
                  <span className="text-xs font-normal text-ink-500">{action.description}</span>
                </ButtonLink>
              </li>
            </Reveal>
          ))}
        </ul>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-500">
          <Icon name="clock" className="size-4 shrink-0" strokeWidth={2} />
          WhatsApp messages are answered during office hours, and usually much sooner.
        </p>
      </Container>
    </Section>
  )
}
