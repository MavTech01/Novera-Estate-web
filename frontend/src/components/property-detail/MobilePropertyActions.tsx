import { useElementInView } from '@/shared/hooks/useElementInView'
import { useScrolled } from '@/shared/hooks/useScrolled'
import { buildCallUrl, buildPropertyInquiry, buildWhatsAppLabel, buildWhatsAppUrl } from '@/shared/lib/contactLinks'
import { cn } from '@/shared/lib/cn'
import type { PropertyDetail } from '@/types'
import { BrandIcon } from '@/shared/components/ui/BrandIcon'
import { Icon } from '@/shared/components/ui/Icon'

interface MobilePropertyActionsProps {
  property: PropertyDetail
  onRequestInspection: () => void
  className?: string
}

/**
 * Persistent action bar for phones.
 *
 * Mirrors the three actions from the sidebar and slides in once the visitor has
 * scrolled past the gallery, so the page's next step is never more than a thumb
 * away. It steps aside when the footer is on screen, so it never sits on top of
 * the legal links.
 */
export function MobilePropertyActions({ property, onRequestInspection, className }: MobilePropertyActionsProps) {
  const hasScrolled = useScrolled(520)
  const isFooterVisible = useElementInView('#site-footer')
  const isVisible = hasScrolled && !isFooterVisible

  const whatsappHref = buildWhatsAppUrl(property.agent.phone, buildPropertyInquiry(property))
  const whatsappLabel = buildWhatsAppLabel().replace('Chat on ', '')

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 backdrop-blur-md lg:hidden',
        'pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-[var(--ease-out-soft)]',
        isVisible ? 'translate-y-0' : 'translate-y-full',
        className,
      )}
    >
      <div className="grid grid-cols-3 gap-2 p-3">
        <a
          href={buildCallUrl(property.agent.phone)}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-sand-200 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:border-accent-300 hover:text-accent-700"
        >
          <Icon name="phone" className="size-4 shrink-0" strokeWidth={2} />
          Call
        </a>

        <button
          type="button"
          onClick={onRequestInspection}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-accent-200 bg-tint-50 px-2 text-sm font-semibold text-accent-700 transition-colors duration-200 hover:bg-tint-100"
        >
          <Icon name="calendar-search" className="size-4 shrink-0" strokeWidth={2} />
          <span className="truncate">Inspection</span>
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md bg-accent-600 px-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-accent-700"
        >
          <BrandIcon name="whatsapp" className="size-4 shrink-0" />
          <span className="truncate">{whatsappLabel}</span>
        </a>
      </div>
    </div>
  )
}