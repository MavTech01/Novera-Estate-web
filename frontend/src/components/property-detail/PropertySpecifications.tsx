import { getSpecificationRows } from '@/shared/lib/propertyDetails'
import { cn } from '@/shared/lib/cn'
import type { PropertyDetail } from '@/types'

interface PropertySpecificationsProps {
  property: PropertyDetail
  className?: string
}

/**
 * The record sheet: reference, type, listing basis, availability and paperwork.
 * Presented as a definition list so each label is programmatically tied to its
 * value rather than being a loose grid of text.
 */
export function PropertySpecifications({ property, className }: PropertySpecificationsProps) {
  const rows = getSpecificationRows(property)

  return (
    <section aria-labelledby="property-details-heading" className={cn('min-w-0', className)}>
      <h2 id="property-details-heading" className="font-display text-xl text-ink-900 sm:text-2xl">
        Property Details
      </h2>

      <dl className="mt-5 overflow-hidden rounded-xl border border-sand-200">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-baseline justify-between gap-4 border-b border-sand-200 px-5 py-3.5 last:border-b-0"
          >
            <dt className="text-sm text-ink-500">{row.label}</dt>
            <dd className="text-right text-sm font-semibold text-ink-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
