import { cn } from '../../lib/cn'
import type { DocumentStatus, PropertyDocumentation } from '../../types'
import { Icon } from '../ui/Icon'
import type { IconName } from '../../types'

interface PropertyDocumentationProps {
  documentation: PropertyDocumentation
  className?: string
}

const statusIcons: Record<DocumentStatus, IconName> = {
  available: 'check-circle',
  pending: 'clock',
  unavailable: 'close',
}

const statusStyles: Record<DocumentStatus, string> = {
  available: 'bg-success-100 text-success-600',
  pending: 'bg-tint-100 text-accent-700',
  unavailable: 'bg-sand-200 text-ink-500',
}

/**
 * Optional paperwork summary.
 * Entries come straight from the listing, and the demo note travels with them
 * so no document row can be mistaken for a completed legal check.
 */
export function PropertyDocumentation({ documentation, className }: PropertyDocumentationProps) {
  if (!documentation || documentation.entries.length === 0) return null

  return (
    <section aria-labelledby="property-documentation-heading" className={cn('min-w-0', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="property-documentation-heading" className="font-display text-xl text-ink-900 sm:text-2xl">
          Property Documentation
        </h2>

        {documentation.isDemo && (
          <span className="rounded-pill border border-accent-200 bg-tint-50 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent-700">
            Demo information
          </span>
        )}
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documentation.entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-sand-200 bg-white px-5 py-4 transition-colors duration-200 hover:border-accent-200"
          >
            <span className="flex items-center gap-2.5 text-sm text-ink-600">
              <Icon name="file-text" className="size-4 shrink-0 text-ink-400" strokeWidth={1.5} />
              {entry.label}
            </span>

            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1 text-xs font-semibold',
                statusStyles[entry.status],
              )}
            >
              <Icon name={statusIcons[entry.status]} className="size-3.5" strokeWidth={2.2} />
              {entry.value}
            </span>
          </li>
        ))}
      </ul>

      {documentation.note && (
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
          <Icon name="triangle-alert" className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
          {documentation.note}
        </p>
      )}
    </section>
  )
}
