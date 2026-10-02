import { Link } from 'react-router-dom'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { locationPath } from '@/shared/lib/routes'
import { cn } from '@/shared/lib/cn'
import {
  locationDescriptorLabels,
  locationDescriptorNotes,
} from '@/features/locations/data/locationOptions'
import type {
  LocationComparisonDescriptor,
  LocationComparisonTable,
} from '@/features/locations/types/locationTypes'

interface LocationComparisonProps {
  table: LocationComparisonTable
  className?: string
}

/**
 * "Explore Areas That Match Your Needs" — how the areas differ, attribute by
 * attribute.
 *
 * The indicators are words ("Strong", "Moderate", "Limited"), never numbers,
 * stars or ranks. A score would invite the reading that a high one means a
 * better area, which is exactly the claim this section must not make: the point
 * is to explain the trade-offs, and the trade-off only matters relative to what
 * the visitor actually needs.
 *
 * The descriptor is carried by an icon and its own label as well as by colour,
 * so the table is readable without colour perception — and the column and cell
 * text is exposed to assistive tech through real table markup.
 *
 * On mobile the table scrolls horizontally rather than collapsing into cards.
 * Collapsing would mean repeating every attribute under every area, which turns
 * a comparison into six separate descriptions and loses the whole point.
 */
export function LocationComparison({ table, className }: LocationComparisonProps) {
  const { locations, rows } = table

  if (locations.length === 0) return null

  return (
    <Section tone="white" className={className}>
      <Container>
        <SectionHeading
          eyebrow="Side by side"
          title="Compare Lagos Locations"
          description="Every area has its own trade-offs. This is a general comparison of the areas we cover — not a ranking, and not a promise about any individual street or estate."
        />

        <Reveal className="mt-10 lg:mt-12">
          <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0 no-scrollbar">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                General comparison of the areas we cover across {rows.length} factors
              </caption>

              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-56 border-b border-sand-200 bg-white px-4 py-4 text-[length:var(--text-label)] uppercase leading-4 text-ink-500"
                  >
                    Area
                  </th>
                  {rows.map((row) => (
                    <th
                      key={row.attribute.id}
                      scope="col"
                      className="min-w-[9rem] border-b border-sand-200 px-4 py-4 align-bottom"
                    >
                      <span className="flex items-center gap-1.5 font-display text-sm font-bold text-ink-900">
                        <Icon name={row.attribute.icon} className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
                        {row.attribute.label}
                      </span>
                      <span className="mt-1.5 block text-xs font-normal leading-relaxed text-ink-400">
                        {row.attribute.description}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-sand-200">
                {locations.map((location) => (
                  <tr key={location.id} className="transition-colors duration-200 hover:bg-tint-50">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-4 py-4 text-left align-middle font-normal"
                    >
                      <Link
                        to={locationPath(location.slug)}
                        className="font-display text-base font-bold text-ink-900 transition-colors duration-200 hover:text-accent-700"
                      >
                        {location.name}
                      </Link>
                      <span className="mt-0.5 block text-xs font-normal text-ink-500">{location.city}</span>
                    </th>

                    {rows.map((row) => {
                      const cell = row.cells.find((entry) => entry.locationId === location.slug)
                      const descriptor: LocationComparisonDescriptor = cell?.descriptor ?? 'moderate'

                      return (
                        <td key={`${row.attribute.id}-${location.id}`} className="px-4 py-4 align-middle">
                          <span
                            title={locationDescriptorNotes[descriptor]}
                            className={cn(
                              'inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold',
                              descriptor === 'strong' && 'text-ink-900',
                              descriptor === 'moderate' && 'text-ink-600',
                              descriptor === 'limited' && 'text-ink-400',
                            )}
                          >
                            <Icon name="check-circle" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
                            {locationDescriptorLabels[descriptor]}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <p className="mt-6 text-xs leading-relaxed text-ink-400">
          These descriptions reflect the general character of each area. Individual streets, estates and schemes vary,
          so treat this as a starting point for a conversation rather than a set of facts about a specific property.
        </p>
      </Container>
    </Section>
  )
}
