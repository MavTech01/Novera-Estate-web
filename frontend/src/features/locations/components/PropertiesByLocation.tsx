import { Link } from 'react-router-dom'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { propertiesPathForLocation } from '@/shared/lib/routes'
import { cn } from '@/shared/lib/cn'
import type { Location } from '@/features/locations/types/locationTypes'

interface PropertiesByLocationProps {
  locations: Location[]
  /** Dims the cards while the catalogue is being replaced. */
  isLoading?: boolean
  className?: string
}

/**
 * "Find Properties by Location" — modern, responsive catalogue directory.
 *
 * Each location card highlights sample inventory, popular property types,
 * and direct one-tap links to the full properties catalogue pre-filtered
 * to that specific area.
 */
export function PropertiesByLocation({ locations, isLoading = false, className }: PropertiesByLocationProps) {
  if (locations.length === 0) return null

  return (
    <Section
      tone="white"
      spacing="none"
      className={cn('pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-10 lg:pb-12', className)}
      ariaLabelledBy="properties-by-location"
    >
      <Container>
        <SectionHeading
          id="properties-by-location"
          eyebrow="Browse the catalogue"
          title="Find Properties by Location"
          description="Jump straight into the properties catalogue for the area you are considering. Counts below are sample figures."
        />

        <Reveal className="mt-10 lg:mt-12">
          <div
            className={cn(
              'grid grid-cols-1 gap-5 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6',
              isLoading && 'pointer-events-none opacity-60',
            )}
          >
            {locations.map((location) => {
              const href = propertiesPathForLocation(location.propertyLocationSlugs)

              return (
                <article
                  key={location.id}
                  className={cn(
                    'group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl border border-sand-200 bg-white p-5 sm:p-6 shadow-xs',
                    'transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent-300 hover:shadow-md',
                    'focus-within:-translate-y-1 focus-within:border-accent-300 focus-within:shadow-md',
                  )}
                >
                  <div>
                    {/* Header Row: Thumbnail + Location Info */}
                    <div className="flex items-start gap-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-sand-200/80 bg-tint-100 shadow-xs sm:size-20">
                        <SkeletonImage
                          src={location.image.src}
                          alt={location.image.alt}
                          width={160}
                          height={160}
                          className="size-full"
                          imgClassName="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <h3 className="truncate font-display text-lg font-bold text-ink-900 transition-colors duration-200 group-hover:text-accent-600 sm:text-xl">
                            <Link
                              to={href}
                              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                            >
                              {location.name}
                              <span className="sr-only"> — view properties in {location.name}</span>
                            </Link>
                          </h3>
                          <span className="inline-flex shrink-0 items-center rounded-pill border border-accent-100 bg-tint-50 px-2.5 py-0.5 text-xs font-semibold text-accent-800">
                            {location.propertyCount} {location.propertyCount === 1 ? 'home' : 'homes'}
                          </span>
                        </div>

                        <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
                          <Icon name="map-pin" className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
                          <span className="truncate">{location.regionLabel}</span>
                        </p>

                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink-600">
                          {location.description}
                        </p>
                      </div>
                    </div>

                    {/* Popular Types Chips */}
                    {location.popularPropertyTypes.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        {location.popularPropertyTypes.slice(0, 3).map((type) => (
                          <span
                            key={type}
                            className="inline-block rounded-md bg-sand-100/70 px-2 py-0.5 text-[11px] font-medium text-ink-600"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Row: Developments count + CTA */}
                  <div className="mt-4 flex items-center justify-between border-t border-sand-100 pt-3.5 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 font-normal text-ink-500">
                      <Icon name="building-2" className="size-3.5 text-accent-500" strokeWidth={2} />
                      {location.projectCount} {location.projectCount === 1 ? 'development' : 'developments'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-accent-600 transition-colors duration-200 group-hover:text-accent-700">
                      Browse catalogue
                      <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
