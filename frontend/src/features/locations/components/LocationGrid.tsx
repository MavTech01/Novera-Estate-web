import { cn } from '@/shared/lib/cn'
import type { Location } from '@/features/locations/types/locationTypes'
import { LocationCard } from './LocationCard'

interface LocationGridProps {
  locations: Location[]
  /** Announced while the grid swaps, e.g. "Showing 6 locations". */
  label?: string
  /** Merged with the layout classes, so callers can add state styling only. */
  className?: string
}

/**
 * Responsive area grid: three columns on desktop, two on tablet, one on mobile.
 *
 * Each card is a list item so assistive tech announces "N of M" correctly, and
 * the entrance stagger is driven by the card's own index.
 */
export function LocationGrid({ locations, label, className }: LocationGridProps) {
  return (
    <ul
      aria-label={label ?? 'Locations'}
      className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7', className)}
    >
      {locations.map((location, index) => (
        <li key={location.id} className="flex">
          <LocationCard location={location} index={index % 6} />
        </li>
      ))}
    </ul>
  )
}
