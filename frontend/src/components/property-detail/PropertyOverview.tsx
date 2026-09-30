import { getOverviewStats } from '../../lib/propertyDetails'
import { cn } from '../../lib/cn'
import type { PropertyDetail } from '../../types'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'

interface PropertyOverviewProps {
  property: PropertyDetail
  className?: string
}

/**
 * "At a glance" strip: the numbers a buyer scans before reading anything.
 * Figures the listing does not record (a plot has no bedrooms) are omitted
 * rather than shown as a zero.
 */
export function PropertyOverview({ property, className }: PropertyOverviewProps) {
  const stats = getOverviewStats(property)

  if (stats.length === 0) return null

  return (
    <section aria-labelledby="property-overview-heading" className={cn('min-w-0', className)}>
      <h2 id="property-overview-heading" className="sr-only">
        Property overview
      </h2>

      <Reveal>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-sand-200 bg-sand-200 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center gap-1.5 bg-white px-4 py-5 text-center">
              <Icon name={stat.icon} className="size-5 text-accent-500" strokeWidth={1.75} />
              <dd className="font-display text-lg leading-none text-ink-900">{stat.value}</dd>
              <dt className="text-xs font-medium text-ink-400">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
