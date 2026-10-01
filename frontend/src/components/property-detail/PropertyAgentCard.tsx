import { buildCallUrl, buildPropertyInquiry, buildWhatsAppUrl } from '@/shared/lib/contactLinks'
import { cn } from '@/shared/lib/cn'
import type { Agent, PropertyDetail } from '@/types'
import { BrandIcon } from '@/shared/components/ui/BrandIcon'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'

interface PropertyAgentCardProps {
  agent: Agent
  property: Pick<PropertyDetail, 'title' | 'location'>
  className?: string
}

/**
 * The assigned consultant.
 *
 * WhatsApp is the primary action because it is how most enquiries actually
 * happen; call sits next to it. Both open with the listing already named in the
 * message, so the agent never has to ask which property the visitor means.
 */
export function PropertyAgentCard({ agent, property, className }: PropertyAgentCardProps) {
  const whatsappHref = buildWhatsAppUrl(agent.phone, buildPropertyInquiry(property))

  return (
    <section
      aria-labelledby="property-agent-heading"
      className={cn('rounded-xl border border-sand-200 bg-white p-6 shadow-sm', className)}
    >
      <p className="text-[length:var(--text-label)] uppercase leading-4 text-accent-600">Speak with an agent</p>

      <div className="mt-5 flex items-center gap-4">
        <SkeletonImage
          src={agent.avatar.src}
          alt={agent.avatar.alt}
          width={160}
          height={160}
          className="size-16 shrink-0 rounded-pill"
        />

        <div className="min-w-0">
          <h2 id="property-agent-heading" className="font-display text-lg leading-snug text-ink-900">
            {agent.name}
          </h2>
          <p className="mt-0.5 text-sm text-ink-500">{agent.role}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 border-t border-sand-200 pt-5">
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2 text-sm text-ink-500">
            <Icon name="phone" className="size-4 text-ink-400" strokeWidth={1.5} />
            Phone
          </dt>
          <dd>
            <a
              href={buildCallUrl(agent.phone)}
              className="text-sm font-semibold text-ink-900 transition-colors duration-200 hover:text-accent-700"
            >
              {agent.phone}
            </a>
          </dd>
        </div>

        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2 text-sm text-ink-500">
            <Icon name="mail" className="size-4 text-ink-400" strokeWidth={1.5} />
            Email
          </dt>
          <dd className="min-w-0">
            <a
              href={`mailto:${agent.email}`}
              className="block truncate text-sm font-semibold text-ink-900 transition-colors duration-200 hover:text-accent-700"
            >
              {agent.email}
            </a>
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-col gap-2.5">
        <ButtonLink
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
          variant="primary"
          size="md"
          className="w-full"
        >
          <BrandIcon name="whatsapp" className="size-[1.15rem]" />
          WhatsApp
        </ButtonLink>

        <a
          href={buildCallUrl(agent.phone)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-sand-200 bg-white text-[0.9375rem] font-semibold text-ink-900 transition-all duration-200 ease-[var(--ease-out-soft)] hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700"
        >
          <Icon name="phone" className="size-4" strokeWidth={2} />
          Call Agent
        </a>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ink-400">
        Enquiries are answered within one working day.
      </p>
    </section>
  )
}
