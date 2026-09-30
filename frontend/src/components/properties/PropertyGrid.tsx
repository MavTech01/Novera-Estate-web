import type { Property } from '../../types'
import { PropertyCard } from './PropertyCard'

interface PropertyGridProps {
  properties: Property[]
  isFavourite?: (id: string) => boolean
  onToggleFavourite?: (id: string) => void
  /** Announced while the grid swaps pages, e.g. "Showing 7 to 12 of 28 properties". */
  label?: string
  className?: string
}

/**
 * Responsive listing grid: 3 columns on desktop, 2 on tablet, 1 on mobile.
 * Each card is a list item so assistive tech announces "N of M" correctly, and
 * the entrance stagger is driven by the card's own `--stagger-index`.
 */
export function PropertyGrid({
  properties,
  isFavourite,
  onToggleFavourite,
  label,
  className,
}: PropertyGridProps) {
  return (
    <ul aria-label={label ?? 'Property listings'} className={className ?? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7'}>
      {properties.map((property, index) => (
        <li key={property.id} className="flex">
          <PropertyCard
            property={property}
            index={index % 6}
            isFavourite={isFavourite?.(property.id)}
            onToggleFavourite={onToggleFavourite ? () => onToggleFavourite(property.id) : undefined}
          />
        </li>
      ))}
    </ul>
  )
}
