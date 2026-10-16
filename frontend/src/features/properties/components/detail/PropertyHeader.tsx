import { Link } from 'react-router-dom'
import { FavouriteButton } from '@/shared/components/properties/FavouriteButton'
import { formatDate } from '@/shared/lib/format'
import { propertyTypeLabels } from '@/shared/lib/labels'
import type { PropertyDetail } from '@/types'
import { Badge } from '@/shared/components/ui/Badge'
import { Icon } from '@/shared/components/ui/Icon'
import { PropertyPrice } from './PropertyPrice'
import { PropertyShareButtons } from './PropertyShareButtons'

interface PropertyHeaderProps {
  property: PropertyDetail
  isFavourite: boolean
  onToggleFavourite: () => void
  className?: string
}

/** Pill above the title. Sales read differently from rentals, and new stock is called out. */
function listingBadge(property: PropertyDetail) {
  if (property.status === 'new-listing') return <Badge tone="orange">New Listing</Badge>
  if (property.purpose === 'rent') return <Badge tone="dark">For Rent</Badge>
  return <Badge tone="light">For Sale</Badge>
}

/**
 * Identity block for the listing: status, type, title, location, price, plus
 * the save and share controls. Sits beside the gallery on desktop and directly
 * under it on mobile.
 */
export function PropertyHeader({
  property,
  isFavourite,
  onToggleFavourite,
  className,
}: PropertyHeaderProps) {
  return (
    <header className={className}>
      <div className="flex flex-wrap items-center gap-2">
        {listingBadge(property)}

        <Badge tone="outline" icon={property.propertyType === 'land' ? 'land-plot' : 'building-2'}>
          {property.subType}
        </Badge>

        {property.isFeatured && <Badge tone="softOrange" icon="sparkles">Featured</Badge>}

        {property.isVerified && (
          <Badge tone="light" icon="badge-check">
            Verified
          </Badge>
        )}
      </div>

      <h1 className="mt-4 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.14] tracking-[-0.028em] text-ink-900">
        {property.title}
      </h1>

      <p className="mt-3 flex items-center gap-1.5 text-[0.9375rem] text-ink-500">
        <Icon name="map-pin" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
        <Link
          to={`/properties?location=${property.location.slug}`}
          className="transition-colors duration-200 hover:text-accent-700"
        >
          {property.location.label}
        </Link>
        <span className="text-sand-300" aria-hidden>
          ·
        </span>
        <span>{propertyTypeLabels[property.propertyType]}</span>
      </p>

      <PropertyPrice property={property} className="mt-6" />

      <dl className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-sand-200 py-4 text-sm text-ink-500">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Reference</dt>
          <Icon name="key" className="size-4 text-ink-400" strokeWidth={1.5} />
          <dd>Ref: {property.reference}</dd>
        </div>

        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Listed on</dt>
          <Icon name="calendar" className="size-4 text-ink-400" strokeWidth={1.5} />
          <dd>Listed {formatDate(property.listedAt)}</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <FavouriteButton
          isFavourite={isFavourite}
          onToggle={onToggleFavourite}
          propertyTitle={property.title}
          tone="plain"
        />

        <PropertyShareButtons property={property} />
      </div>
    </header>
  )
}
