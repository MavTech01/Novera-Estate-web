import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { formatPrice } from '@/shared/lib/format'
import { propertyTypeLabels } from '@/shared/lib/labels'
import { propertyPath } from '@/shared/lib/routes'
import type { Property } from '@/types'
import { Badge } from '@/shared/components/ui/Badge'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { FavouriteButton } from './FavouriteButton'
import { PropertyMeta } from './PropertyMeta'

interface PropertyCardProps {
  property: Property
  isFavourite?: boolean
  onToggleFavourite?: () => void
  /** Stagger index — the grid feeds it to the entrance animation. */
  index?: number
  className?: string
}

/** Status pill: rentals read differently from sales, and new stock is called out. */
function listingBadge(property: Property) {
  if (property.status === 'new-listing') return <Badge tone="orange">New</Badge>
  if (property.purpose === 'rent') return <Badge tone="dark">For Rent</Badge>
  return <Badge tone="light">For Sale</Badge>
}

/**
 * The single listing card used by the homepage grid and the listing page.
 *
 * The title link stretches across the whole card so the entire surface is
 * tappable on mobile, while the favourite button and its `z-10` keep the
 * overlay controls above it.
 */
export function PropertyCard({
  property,
  isFavourite = false,
  onToggleFavourite,
  index = 0,
  className,
}: PropertyCardProps) {
  const href = propertyPath(property.slug)
  const cover = property.images[0]

  return (
    <article
      className={cn(
        'card-stagger group relative flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white',
        'shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)]',
        'hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lg',
        'focus-within:-translate-y-1.5 focus-within:shadow-lg',
        className,
      )}
      style={{ '--stagger-index': index } as React.CSSProperties}
    >
      {/*
        Media. No overflow-hidden here: the price pill below is meant to overlap
        the image's bottom edge and would be clipped by it — the article's own
        overflow-hidden still rounds the top corners.
      */}
      <div className="relative aspect-[4/3] bg-tint-100">
        <SkeletonImage
          src={cover?.src ?? ''}
          alt={cover?.alt ?? `${property.title} in ${property.location.label}`}
          width={900}
          height={675}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />

        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {listingBadge(property)}
            {property.isFeatured && (
              <Badge tone="dark" icon="sparkles" className="hidden sm:inline-flex">
                Featured
              </Badge>
            )}
          </div>

          {onToggleFavourite && (
            <FavouriteButton
              isFavourite={isFavourite}
              onToggle={onToggleFavourite}
              propertyTitle={property.title}
            />
          )}
        </div>

        {/* Price badge overlaps the media edge, aligned with the body's 20px padding. */}
        <div className="absolute bottom-0 left-5 z-10 flex translate-y-1/2 items-center gap-2">
          <Badge tone={property.purpose === 'rent' ? 'dark' : 'orange'} className="px-4 py-1.5 text-sm shadow-md">
            {formatPrice(property.price, property.pricePeriod)}
          </Badge>

          {property.isVerified && (
            <Badge
              tone="light"
              icon="badge-check"
              className="hidden px-2.5 py-1.5 text-xs shadow-sm sm:inline-flex"
            >
              Verified
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-8">
        <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
          <Icon name="map-pin" className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
          <span className="truncate">{property.location.label}</span>
        </p>

        <h3 className="mt-2 font-display text-lg leading-snug text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <Link
            to={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {property.title}
            <span className="sr-only"> — view property</span>
          </Link>
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

          {/*
            The stretched title link already makes the card clickable, so this is
            a labelled cue rather than a second tab stop for the same action.
          */}
          <span
            aria-hidden
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors duration-200 group-hover:text-accent-700"
          >
            View Property
            <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </article>
  )
}
