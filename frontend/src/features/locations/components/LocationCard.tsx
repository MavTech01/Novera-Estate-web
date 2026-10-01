import { ButtonLink } from '@/shared/components/ui/Button'
import { Link } from '@/shared/components/ui/Link'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { cn } from '@/shared/lib/cn'
import { locationPath } from '@/shared/lib/routes'
import type { Location } from '@/features/locations/types/locationTypes'
import { formatProjectCount, formatPropertyCount, locationCtaLabel } from '@/features/locations/utils/locationUtils'

interface LocationCardProps {
  location: Location
  /** Stagger index — the grid feeds it to the entrance animation. */
  index?: number
  className?: string
}

/**
 * A single area card.
 *
 * The title link stretches across the whole card so the entire surface is
 * tappable on mobile, which is why the "Explore Lekki" cue at the bottom is a
 * button-styled span rather than a second link to the same place — two links
 * with the same destination read as redundant to a screen reader.
 *
 * Every count rendered here is sample data, which is what the demo notice above
 * the grid is for.
 */
export function LocationCard({ location, index = 0, className }: LocationCardProps) {
  const href = locationPath(location.slug)

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
      <div className="relative aspect-[3/2] overflow-hidden bg-tint-100">
        <SkeletonImage
          src={location.image.src}
          alt={location.image.alt}
          width={900}
          height={600}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />

        {/* Scrim keeps the category pill legible over lighter photography. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-900/45 to-transparent"
        />

        <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-start gap-1.5 p-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm">
            <Icon name="map-pin" className="size-3.5 text-accent-600" strokeWidth={2} />
            {location.regionLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {location.name}
            <span className="sr-only"> — explore this location</span>
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{location.description}</p>

        {/* Counts are sample figures, so the label says so rather than letting
            the number read as live inventory. */}
        <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sand-200 pt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Icon name="house" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
            <dt className="sr-only">Properties</dt>
            <dd className="font-semibold text-ink-900">{formatPropertyCount(location.propertyCount)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="building-2" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
            <dt className="sr-only">Developments</dt>
            <dd className="font-semibold text-ink-900">{formatProjectCount(location.projectCount)}</dd>
          </div>
        </dl>

        <div className="mt-5">
          <ButtonLink href={href} size="sm" className="w-full sm:w-auto">
            {locationCtaLabel(location)}
            <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
