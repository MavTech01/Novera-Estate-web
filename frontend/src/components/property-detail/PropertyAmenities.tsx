import { cn } from '../../lib/cn'
import { getFeatureIcon } from '../../lib/featureIcons'
import { Icon } from '../ui/Icon'

interface PropertyAmenitiesProps {
  amenities: string[]
  className?: string
}

/**
 * Shorter, secondary list of what the property offers — the extras that sit
 * alongside the headline features (a pantry, a balcony, a laundry wing).
 */
export function PropertyAmenities({ amenities, className }: PropertyAmenitiesProps) {
  if (amenities.length === 0) return null

  return (
    <section aria-labelledby="property-amenities-heading" className={cn('min-w-0', className)}>
      <h2 id="property-amenities-heading" className="font-display text-xl text-ink-900 sm:text-2xl">
        Amenities
      </h2>

      <ul className="mt-5 flex flex-wrap gap-2.5">
        {amenities.map((amenity) => (
          <li
            key={amenity}
            className="inline-flex items-center gap-2 rounded-pill border border-sand-200 bg-tint-50 px-4 py-2 text-sm font-medium text-ink-700 transition-colors duration-200 hover:border-accent-200 hover:bg-tint-100"
          >
            <Icon name={getFeatureIcon(amenity)} className="size-4 shrink-0 text-accent-600" strokeWidth={1.75} />
            {amenity}
          </li>
        ))}
      </ul>
    </section>
  )
}
