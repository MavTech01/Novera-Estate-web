import { Link } from 'react-router-dom'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { cn } from '@/shared/lib/cn'
import { locationPath, propertiesPathForLocation } from '@/shared/lib/routes'
import type { Location } from '@/features/locations/types/locationTypes'
import { locationCtaLabel } from '@/features/locations/utils/locationUtils'
import { LocationHighlights } from './LocationHighlights'

interface FeaturedLocationProps {
  location: Location
  className?: string
}

/**
 * The promoted area, given a two-column layout the regular cards never get.
 *
 * Deliberately a *promotion*, not a result: the page shows it only while no
 * search or category is applied, because putting a highlighted area next to
 * search results would contradict whatever the visitor just asked for.
 *
 * Two clear exits — the area's own page, and its properties in the catalogue —
 * because "this looks interesting" and "show me what I can buy here" are two
 * different intents.
 */
export function FeaturedLocation({ location, className }: FeaturedLocationProps) {
  return (
    <article
      className={cn(
        'group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-md lg:grid-cols-2',
        className,
      )}
    >
      <div className="relative min-h-[16rem] overflow-hidden bg-tint-100 lg:min-h-[30rem]">
        <SkeletonImage
          src={location.image.src}
          alt={location.image.alt}
          width={1400}
          height={1050}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/35 to-transparent lg:bg-gradient-to-r"
        />

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-pill bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-ink-900 shadow-sm sm:left-6 sm:top-6">
          <Icon name="sparkles" className="size-3.5 text-accent-600" strokeWidth={2} />
          Featured location
        </span>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
        <p className="flex items-center gap-1.5 text-[length:var(--text-label)] uppercase leading-4 text-accent-600">
          <Icon name="map-pin" className="size-3.5" strokeWidth={2.2} />
          {location.regionLabel}
        </p>

        <h3 className="mt-4 font-display text-[length:var(--text-subtitle)] text-ink-900">
          <Link to={locationPath(location.slug)} className="after:absolute after:inset-0 after:content-['']">
            {location.name}, {location.state}
            <span className="sr-only"> — explore this location</span>
          </Link>
        </h3>

        <p className="mt-4 text-base leading-relaxed text-ink-500">{location.description}</p>

        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">Properties</dt>
            <dd className="mt-1.5 font-display text-2xl font-bold leading-none text-ink-900">
              {location.propertyCount.toLocaleString('en-NG')}
            </dd>
            <p className="mt-1.5 text-xs text-ink-500">listed in this area</p>
          </div>
          <div>
            <dt className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">Developments</dt>
            <dd className="mt-1.5 font-display text-2xl font-bold leading-none text-ink-900">
              {location.projectCount.toLocaleString('en-NG')}
            </dd>
            <p className="mt-1.5 text-xs text-ink-500">
              {location.projectCount === 1 ? 'development here' : 'developments here'}
            </p>
          </div>
        </dl>

        <div className="mt-7">
          <LocationHighlights highlights={location.highlights.slice(0, 3)} columns={3} />
        </div>

        {/* The stretched heading link already makes the whole block clickable, so
            these are the two distinct destinations rather than a repeat of it. */}
        <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href={locationPath(location.slug)} withArrow>
            {locationCtaLabel(location)}
          </ButtonLink>
          <ButtonLink
            href={propertiesPathForLocation(location.propertyLocationSlugs)}
            variant="outline"
            withArrow
          >
            View Properties Here
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}

/** Skeleton matching `FeaturedLocation`, for the first unhydrated load. */
export function FeaturedLocationSkeleton({ className }: { className?: string }) {
  return (
    <Reveal
      aria-hidden
      className={cn(
        'grid grid-cols-1 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm lg:grid-cols-2',
        className,
      )}
    >
      <div className="min-h-[16rem] bg-tint-50 lg:min-h-[30rem]" />
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
        <div className="h-3 w-40 rounded-pill bg-tint-50" />
        <div className="mt-4 h-8 w-2/3 rounded-md bg-tint-50" />
        <div className="mt-4 h-4 w-full rounded bg-tint-50" />
        <div className="mt-2 h-4 w-4/5 rounded bg-tint-50" />
        <div className="mt-7 flex gap-10">
          <div className="h-12 w-24 rounded-md bg-tint-50" />
          <div className="h-12 w-24 rounded-md bg-tint-50" />
        </div>
        <div className="mt-8 h-12 w-52 rounded-md bg-tint-50" />
      </div>
    </Reveal>
  )
}
