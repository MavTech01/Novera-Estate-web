import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'

interface InspectionCTAProps {
  propertyTitle: string
  onRequestInspection: () => void
  className?: string
}

/**
 * Persistent prompt to book a viewing.
 * This is the only standalone CTA band inside the content column, so the page
 * keeps a single obvious next step instead of competing buttons everywhere.
 */
export function InspectionCTA({ propertyTitle, onRequestInspection, className }: InspectionCTAProps) {
  return (
    <section
      aria-labelledby="inspection-cta-heading"
      className={cn('overflow-hidden rounded-xl border border-accent-200 bg-tint-50', className)}
    >
      <div className="p-6 sm:p-7">
        <span className="flex size-11 items-center justify-center rounded-pill bg-white text-accent-600 shadow-sm">
          <Icon name="calendar-search" className="size-5" strokeWidth={1.75} />
        </span>

        <h2 id="inspection-cta-heading" className="mt-4 font-display text-xl leading-snug text-ink-900">
          Interested in This Property?
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Schedule an inspection and let our team help you view {propertyTitle} in person.
        </p>

        <button
          type="button"
          onClick={onRequestInspection}
          className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-accent-600 px-6 text-base font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800"
        >
          <Icon name="calendar" className="size-[1.1rem]" strokeWidth={2} />
          Schedule an Inspection
        </button>

        <p className="mt-3 text-xs leading-relaxed text-ink-400">
          Pick a preferred date and time — we will confirm by phone or WhatsApp.
        </p>
      </div>
    </section>
  )
}
