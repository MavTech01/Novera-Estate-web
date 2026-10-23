import { Link } from 'react-router-dom'
import { locationPath, propertiesPathForLocationSlug } from '@/shared/lib/routes'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { Location } from '@/features/locations/types/locationTypes'
import type { LocationMapMetadata } from './locationExplorerData'

interface LocationSummaryCardProps {
  location: Location
  metadata: LocationMapMetadata
}

/**
 * Preview summary card displayed alongside the interactive map, detailing
 * properties, highlights, and direct listing CTAs for the selected location.
 * Features a full-width image header that bleeds to the top edges of the card.
 */
export function LocationSummaryCard({
  location,
  metadata,
}: LocationSummaryCardProps) {
  return (
    <Reveal key={location.id} className="h-full">
      <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-sm transition-all duration-300">
        <div>
          {/* Full-Width Photo Preview Thumbnail (Bleeds edge-to-edge across the top) */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-tint-100 sm:aspect-[2/1] lg:aspect-[16/9]">
            <SkeletonImage
              src={location.image.src}
              alt={location.image.alt}
              width={900}
              height={600}
              className="size-full object-cover"
            />
            {/* Soft bottom gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Badges on image */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[clamp(0.6875rem,2.2vw,0.75rem)] font-bold text-ink-900 shadow-md backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Verified Novera Hub
              </span>
            </div>

            <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-2 text-white">
              <div>
                <span className="text-[clamp(0.5625rem,1.8vw,0.625rem)] font-bold uppercase tracking-wider text-sand-200">
                  Available Listings
                </span>
                <p className="font-display text-[clamp(1.125rem,3.8vw,1.5rem)] font-extrabold leading-tight text-white">
                  {location.availableProperties} Properties
                </p>
              </div>
              <span className="rounded-full bg-accent-600 px-2.5 py-0.5 text-[clamp(0.6875rem,2.2vw,0.75rem)] font-bold text-white shadow-sm sm:px-3 sm:py-1">
                {metadata.badge}
              </span>
            </div>
          </div>

          {/* Card Body Content with Internal Padding */}
          <div className="p-5 sm:p-6 lg:p-7">
            {/* Location Header & Zone */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-600">
                <Icon name="map-pin" className="size-3.5" strokeWidth={2.5} />
                {metadata.zone}
              </span>
              <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-ink-600">
                {location.city}, {location.state}
              </span>
            </div>

            <h3 className="mt-1.5 font-display text-2xl font-extrabold text-ink-900">
              {location.name}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              {location.description}
            </p>

            {/* Key Area Highlights Checklist */}
            <div className="mt-4 border-t border-sand-200 pt-4">
              <h4 className="text-[0.6875rem] font-bold uppercase tracking-wider text-ink-400">
                Estate & Neighborhood Highlights:
              </h4>
              <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {metadata.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-xs leading-snug text-ink-700"
                  >
                    <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                      <Icon name="check" className="size-2 text-accent-700" strokeWidth={3} />
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons: View Properties & Links */}
        <div className="border-t border-sand-200 p-5 pt-4 sm:p-6 sm:pt-5 lg:p-7 lg:pt-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Primary 'View Properties' button */}
            <Link
              to={propertiesPathForLocationSlug(location.slug)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-accent-700 hover:scale-[1.02] active:bg-accent-800"
            >
              <span>View Properties in {location.name}</span>
              <Icon name="arrow-right" className="size-4" strokeWidth={2.5} />
            </Link>

            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <Link
                to={locationPath(location.slug)}
                className="inline-flex items-center gap-1 font-semibold text-ink-700 transition-colors hover:text-accent-600"
              >
                <span>Area Guide</span>
                <Icon name="chevron-right" className="size-3.5" />
              </Link>
              <span className="h-3.5 w-px bg-sand-200" />
              <Link
                to="/contact?type=inspection"
                className="font-semibold text-accent-700 transition-colors hover:underline"
              >
                Book Inspection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
