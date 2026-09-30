import { cn } from '../../lib/cn'
import { formatPrice } from '../../lib/format'
import { propertyStatusLabels, propertyTypeLabels } from '../../lib/labels'
import { propertyPath } from '../../lib/routes'
import type { Property } from '../../types'
import { Badge } from '../ui/Badge'
import { Icon } from '../ui/Icon'
import { SkeletonImage } from '../ui/SkeletonImage'
import { FavouriteButton } from './FavouriteButton'
import { PropertyMeta } from './PropertyMeta'

interface PropertyCardProps {
  property: Property
  isFavourite?: boolean
  onToggleFavourite?: () => void
}

/** Listing card: media, orange price badge, specs and a shortlist toggle. */
export function PropertyCard({ property, isFavourite = false, onToggleFavourite }: PropertyCardProps) {
  const href = propertyPath(property.slug)
  const isRental = property.purpose === 'rent'

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white',
        'shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)]',
        'hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lg',
        'focus-within:-translate-y-1.5 focus-within:shadow-lg',
      )}
    >
      {/*
        Media. No overflow-hidden here: the price pill below is meant to overlap
        the image's bottom edge and would be clipped by it — the article's own
        overflow-hidden still rounds the top corners.
      */}
      <div className="relative aspect-[4/3] bg-tint-100">
        <SkeletonImage
          src={property.images[0]?.src ?? ''}
          alt={property.images[0]?.alt ?? property.title}
          width={900}
          height={675}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3.5">
          {property.status === 'new-listing' ? (
            <Badge tone="orange">New</Badge>
          ) : (
            <Badge tone={isRental ? 'dark' : 'light'}>{isRental ? 'For Rent' : 'For Sale'}</Badge>
          )}

          {onToggleFavourite && (
            <FavouriteButton
              isFavourite={isFavourite}
              onToggle={onToggleFavourite}
              propertyTitle={property.title}
            />
          )}
        </div>

        {/* Price badge overlaps the media edge, aligned with the body's 20px padding. */}
        <div className="absolute bottom-0 left-5 z-10 translate-y-1/2">
          <Badge tone={isRental ? 'dark' : 'orange'} className="px-4 py-1.5 text-sm shadow-md">
            {formatPrice(property.price, property.pricePeriod)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-8">
        <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
          <Icon name="map-pin" className="size-3.5 text-accent-500" strokeWidth={2} />
          {property.location.label}
        </p>

        <h3 className="mt-2 font-display text-lg leading-snug text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <a href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {property.title}
          </a>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{property.summary}</p>

        <PropertyMeta
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          area={property.area}
          className="mt-4 border-t border-sand-200 pt-4"
        />

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-600">
            {propertyTypeLabels[property.propertyType]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
            {propertyStatusLabels[property.status]}
            <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </article>
  )
}
