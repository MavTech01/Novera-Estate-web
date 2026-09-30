import { buildCallUrl, buildPropertyInquiry, buildWhatsAppLabel, buildWhatsAppUrl } from '../../lib/contactLinks'
import { cn } from '../../lib/cn'
import type { PropertyDetail } from '../../types'
import { BrandIcon } from '../ui/BrandIcon'
import { Button, ButtonLink } from '../ui/Button'
import { Icon } from '../ui/Icon'

interface PropertyActionsProps {
  property: PropertyDetail
  onRequestInspection: () => void
  /** `stacked` fills a sidebar, `inline` lays the secondary actions in a row. */
  layout?: 'stacked' | 'inline'
  className?: string
}

/**
 * The three conversion actions for a single listing: WhatsApp, call and
 * inspection request. Rendered once in the sidebar and mirrored in the mobile
 * sticky bar, so the page never stacks competing calls to action.
 */
export function PropertyActions({
  property,
  onRequestInspection,
  layout = 'stacked',
  className,
}: PropertyActionsProps) {
  const isStacked = layout === 'stacked'
  const whatsappHref = buildWhatsAppUrl(property.agent.phone, buildPropertyInquiry(property))

  return (
    <div className={cn(isStacked ? 'flex flex-col gap-2.5' : 'flex flex-col gap-2.5 sm:flex-row', className)}>
      <ButtonLink
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
        variant="primary"
        size="lg"
        className="w-full"
      >
        <BrandIcon name="whatsapp" className="size-5" />
        {buildWhatsAppLabel()}
      </ButtonLink>

      <div className={cn('grid gap-2.5', isStacked ? 'grid-cols-1' : 'sm:grid-cols-2')}>
        <a
          href={buildCallUrl(property.agent.phone)}
          className={cn(
            'inline-flex h-14 items-center justify-center gap-2 rounded-md border border-sand-200 bg-white px-6',
            'text-base font-semibold text-ink-900 transition-all duration-200 ease-[var(--ease-out-soft)]',
            'hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700 active:bg-tint-100',
          )}
        >
          <Icon name="phone" className="size-[1.1rem]" strokeWidth={2} />
          Call Agent
        </a>

        <Button variant="outline" size="lg" className="w-full" onClick={onRequestInspection}>
          <Icon name="calendar-search" className="size-[1.1rem]" strokeWidth={2} />
          Book Inspection
        </Button>
      </div>
    </div>
  )
}
