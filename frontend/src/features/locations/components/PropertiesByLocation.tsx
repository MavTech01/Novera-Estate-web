import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@/shared/components/ui/Link'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { propertiesPathForLocation } from '@/shared/lib/routes'
import { cn } from '@/shared/lib/cn'
import type { Location } from '@/features/locations/types/locationTypes'

interface PropertiesByLocationProps {
  locations: Location[]
  /** Dims the rows while the catalogue is being replaced. */
  isLoading?: boolean
  className?: string
}

/**
 * "Find Properties by Location" — the six areas and their sample property
 * counts, each linking into the properties catalogue already filtered to that
 * area.
 *
 * This section owns no property data. It reads the counts off the location
 * records and hands the filtering to the Properties feature through the URL, so
 * the two pages can never disagree about what "properties in Lekki" means.
 *
 * A table on desktop because it is genuinely tabular — a name, a number and a
 * destination. It collapses to stacked rows on mobile rather than scrolling
 * sideways, because a horizontally-scrolling table is miserable to read on a
 * phone.
 */
export function PropertiesByLocation({ locations, isLoading = false, className }: PropertiesByLocationProps) {
  if (locations.length === 0) return null

  return (
    <Section tone="tint" className={className}>
      <Container>
        <SectionHeading
          eyebrow="Browse the catalogue"
          title="Find Properties by Location"
          description="Jump straight into the properties catalogue for the area you are considering. Counts below are sample figures."
        />

        <Reveal className="mt-10 lg:mt-12">
          <div
            className={cn(
              'overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm transition-opacity duration-200',
              isLoading && 'opacity-60',
            )}
          >
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Sample property counts for each Lagos area, with a link to that area's listings
              </caption>

              <thead className="hidden bg-sand-100 sm:table-header-group">
                <tr>
                  <th scope="col" className="px-6 py-4 text-[length:var(--text-label)] uppercase leading-4 text-ink-500">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-4 text-[length:var(--text-label)] uppercase leading-4 text-ink-500">
                    Properties
                  </th>
                  <th scope="col" className="hidden px-6 py-4 text-right text-[length:var(--text-label)] uppercase leading-4 text-ink-500 md:table-cell">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-sand-200">
                {locations.map((location) => {
                  const href = propertiesPathForLocation(location.propertyLocationSlugs)

                  return (
                    <tr key={location.id} className="group transition-colors duration-200 hover:bg-tint-50">
                      <th
                        scope="row"
                        className="px-5 py-4 text-left align-middle font-normal sm:px-6 sm:py-5"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint-50 text-accent-600">
                            <Icon name="map-pin" className="size-5" strokeWidth={2} />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-display text-base font-bold text-ink-900">
                              {location.name}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-500">{location.regionLabel}</span>
                          </span>
                        </span>
                      </th>

                      <td className="px-5 py-4 align-middle sm:px-6 sm:py-5">
                        <span className="font-display text-lg font-bold text-ink-900">
                          {location.propertyCount.toLocaleString('en-NG')}
                        </span>
                        <span className="ml-1.5 text-sm text-ink-500">
                          {location.propertyCount === 1 ? 'property' : 'properties'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right align-middle sm:px-6 sm:py-5">
                        <Link
                          href={href}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-accent-700 transition-colors duration-200 hover:bg-tint-100 hover:text-accent-800"
                        >
                          <span className="hidden sm:inline">View properties</span>
                          <span className="sm:hidden">View</span>
                          <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
                          <span className="sr-only">in {location.name}</span>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
