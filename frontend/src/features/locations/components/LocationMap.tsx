import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@/shared/components/ui/Link'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { cn } from '@/shared/lib/cn'
import { locationPath } from '@/shared/lib/routes'
import { LOCATION_MAP_NOTE, LOCATION_MAP_PROVIDER_NOTE } from '@/features/locations/data/locationOptions'
import type { Location } from '@/features/locations/types/locationTypes'

interface LocationMapProps {
  locations: Location[]
  /** The area currently highlighted in the plot, e.g. after a search. */
  activeSlug?: string
  className?: string
}

/**
 * "Where We're Located" — a static, map-styled plot of the areas we cover.
 *
 * Deliberately not a real map: no API key, script or third-party embed is
 * loaded in this phase. What exists here is the *container* a map provider will
 * later slot into — a positioned viewport, one pin per area carrying its real
 * name, and a legend list outside the plot so the information is never trapped
 * inside an image.
 *
 * Two deliberate constraints:
 *
 *  - Pins are placed from `mapPosition` percentages, not coordinates. Nothing
 *    here is a surveyed position, and a development site's location must not
 *    become a published address.
 *  - The plot is `aria-hidden`, with the same list rendered beside it as real
 *    markup. A canvas of decorative pins would be an empty region to a screen
 *    reader; the list is the accessible version of the same information.
 */
export function LocationMap({ locations, activeSlug, className }: LocationMapProps) {
  return (
    <Section tone="tint" className={className}>
      <Container>
        <SectionHeading
          eyebrow="Coverage"
          title="Where We're Located"
          description="Our areas sit across the Lagos mainland and the island districts. Select an area to see what we have there."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-5 lg:gap-10">
          <Reveal className="lg:col-span-3">
            <div
              className="relative isolate flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-sand-200 bg-tint-50"
            >
              {/* Decorative map texture — a hint of cartography, not geography. */}
              <div className="dot-grid absolute inset-0 opacity-70" aria-hidden />

              {/* Stylised lagoon and coastline: the shape Lagos is read by. */}
              <svg
                aria-hidden
                viewBox="0 0 400 300"
                preserveAspectRatio="none"
                className="absolute inset-0 size-full opacity-90"
              >
                <path
                  d="M0 150 C 70 150, 110 175, 175 178 C 250 181, 300 205, 400 205 L 400 300 L 0 300 Z"
                  fill="var(--color-tint-100)"
                />
                <path
                  d="M0 150 C 70 150, 110 175, 175 178 C 250 181, 300 205, 400 205"
                  fill="none"
                  stroke="var(--color-accent-300)"
                  strokeWidth="1.5"
                  strokeDasharray="6 5"
                />
                <path
                  d="M0 96 C 90 88, 180 104, 268 92 C 330 84, 366 76, 400 70"
                  fill="none"
                  stroke="var(--color-sand-400)"
                  strokeWidth="1"
                  opacity="0.7"
                />
                <path
                  d="M0 62 C 80 54, 150 68, 226 58"
                  fill="none"
                  stroke="var(--color-sand-400)"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </svg>

              <div className="absolute left-5 top-5 rounded-pill bg-white/90 px-3 py-1.5 text-[length:var(--text-label)] uppercase leading-4 text-ink-500 shadow-sm">
                Lagos, Nigeria
              </div>

              {/* One pin per area, placed from its map position. */}
              <div aria-hidden className="absolute inset-0">
                {locations.map((location) => {
                  const isActive = location.slug === activeSlug

                  return (
                    <span
                      key={location.id}
                      className="absolute -translate-x-1/2 -translate-y-full"
                      style={{ left: `${location.mapPosition.x}%`, top: `${location.mapPosition.y}%` }}
                    >
                      <span
                        className={cn(
                          'flex items-center gap-1.5 whitespace-nowrap rounded-pill border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200',
                          isActive
                            ? 'border-accent-600 bg-accent-600 text-white'
                            : 'border-sand-200 bg-white/95 text-ink-900',
                        )}
                      >
                        <Icon
                          name="map-pin"
                          className={cn('size-3.5', isActive ? 'text-white' : 'text-accent-600')}
                          strokeWidth={2}
                        />
                        {location.name}
                      </span>
                    </span>
                  )
                })}
              </div>

              <p className="sr-only">
                Illustrative plot of Lagos showing our areas: {locations.map((location) => location.name).join(', ')}.
              </p>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-ink-500">{LOCATION_MAP_NOTE}</p>
          </Reveal>

          {/* The accessible, linkable version of the same information. */}
          <Reveal delay={90} className="lg:col-span-2">
            <div className="flex h-full flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-sm sm:p-7">
              <h3 className="font-display text-lg text-ink-900">Areas we cover</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{LOCATION_MAP_PROVIDER_NOTE}</p>

              <ul className="mt-6 flex-1 divide-y divide-sand-200">
                {locations.map((location) => (
                  <li key={location.id}>
                    <Link
                      href={locationPath(location.slug)}
                      className="group flex items-center justify-between gap-4 py-3.5 transition-colors duration-200 hover:text-accent-700"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Icon name="map-pin" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
                            {location.name}
                          </span>
                          <span className="block truncate text-xs text-ink-500">{location.city}</span>
                        </span>
                      </span>

                      <Icon
                        name="arrow-right"
                        className="arrow-nudge size-4 shrink-0 text-ink-400 group-hover:text-accent-600"
                        strokeWidth={2.2}
                      />
                    </Link>
                  </li>
                ))}
              </ul>

              <ButtonLink href="/contact?type=inspection" variant="soft" size="sm" className="mt-6 w-full">
                <Icon name="calendar-search" className="size-4" strokeWidth={2} />
                Arrange a Site Visit
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
