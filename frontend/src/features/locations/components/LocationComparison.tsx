import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { locationPath } from '@/shared/lib/routes'
import { cn } from '@/shared/lib/cn'
import type {
  LocationComparisonDescriptor,
  LocationComparisonTable,
} from '@/features/locations/types/locationTypes'

interface LocationComparisonProps {
  table: LocationComparisonTable
  className?: string
}

const DESCRIPTOR_CONFIG: Record<
  LocationComparisonDescriptor,
  {
    label: string
    note: string
    dots: number
    pillClass: string
    dotClass: string
  }
> = {
  strong: {
    label: 'Strong',
    note: 'A defining strength of this area',
    dots: 3,
    pillClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/70',
    dotClass: 'bg-emerald-600',
  },
  moderate: {
    label: 'Moderate',
    note: 'Available, but varies by neighbourhood',
    dots: 2,
    pillClass: 'bg-amber-50 text-amber-800 border-amber-200/70',
    dotClass: 'bg-amber-500',
  },
  limited: {
    label: 'Limited',
    note: 'Less of a feature here than elsewhere',
    dots: 1,
    pillClass: 'bg-sand-100 text-ink-600 border-sand-200',
    dotClass: 'bg-ink-400',
  },
}

function DescriptorBadge({ descriptor }: { descriptor: LocationComparisonDescriptor }) {
  const config = DESCRIPTOR_CONFIG[descriptor] ?? DESCRIPTOR_CONFIG.moderate

  return (
    <span
      title={config.note}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-semibold shadow-2xs transition-colors',
        config.pillClass,
      )}
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn(
              'size-1.5 rounded-full transition-colors',
              step <= config.dots ? config.dotClass : 'bg-sand-300/60',
            )}
          />
        ))}
      </span>
      <span>{config.label}</span>
    </span>
  )
}

/**
 * "Side by Side" — Compare Lagos locations across key living and investment factors.
 *
 * Fully responsive:
 * - Desktop: Complete comparative matrix with area previews, interactive rows, and clear indicators.
 * - Mobile & Tablet: Interactive head-to-head comparison tool allowing visitors to compare any two
 *   areas side-by-side, plus a full table view toggle.
 */
export function LocationComparison({ table, className }: LocationComparisonProps) {
  const { locations, rows } = table
  const select1Id = useId()
  const select2Id = useId()

  const [loc1Slug, setLoc1Slug] = useState<string>(() => locations[0]?.slug ?? 'lekki')
  const [loc2Slug, setLoc2Slug] = useState<string>(
    () => locations[1]?.slug ?? locations[0]?.slug ?? 'ikoyi',
  )
  const [mobileView, setMobileView] = useState<'compare' | 'table'>('compare')

  if (locations.length === 0) return null

  const loc1 = locations.find((l) => l.slug === loc1Slug) ?? locations[0]
  const loc2 = locations.find((l) => l.slug === loc2Slug) ?? locations[1] ?? locations[0]

  return (
    <Section tone="tint" className={className} ariaLabelledBy="compare-locations-heading">
      <Container>
        <SectionHeading
          id="compare-locations-heading"
          eyebrow="Side by side"
          title="Compare Lagos Locations"
          description="Every area has its own trade-offs. This is a general comparison of the areas we cover — not a ranking, and not a promise about any individual street or estate."
        />

        {/* ========================================================================= */}
        {/* Mobile & Tablet Mode Switcher (< lg)                                      */}
        {/* ========================================================================= */}
        <div className="mt-8 flex items-center justify-center lg:hidden">
          <div className="inline-flex rounded-xl border border-sand-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setMobileView('compare')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200',
                mobileView === 'compare'
                  ? 'bg-accent-600 text-white shadow-xs'
                  : 'text-ink-600 hover:text-ink-900',
              )}
            >
              <Icon name="sliders-horizontal" className="size-3.5" strokeWidth={2} />
              Head-to-Head Compare
            </button>
            <button
              type="button"
              onClick={() => setMobileView('table')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200',
                mobileView === 'table'
                  ? 'bg-accent-600 text-white shadow-xs'
                  : 'text-ink-600 hover:text-ink-900',
              )}
            >
              <Icon name="layers" className="size-3.5" strokeWidth={2} />
              Full Matrix
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Mobile Head-to-Head Comparison Card                                       */}
        {/* ========================================================================= */}
        {mobileView === 'compare' && (
          <div className="mt-6 lg:hidden">
            <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-5 shadow-xs sm:p-6">
              {/* Selector Controls */}
              <div className="grid grid-cols-2 gap-3 pb-5 border-b border-sand-200">
                {/* Location 1 Selector */}
                <div>
                  <label htmlFor={select1Id} className="block text-xs font-semibold text-ink-500 mb-1.5">
                    Location A
                  </label>
                  <div className="relative">
                    <select
                      id={select1Id}
                      value={loc1Slug}
                      onChange={(e) => setLoc1Slug(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-sand-300 bg-sand-50/60 px-3 py-2.5 pr-8 text-sm font-bold text-ink-900 shadow-2xs focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.slug}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="chevron-down"
                      className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"
                    />
                  </div>
                  {loc1 && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="size-8 shrink-0 overflow-hidden rounded-lg border border-sand-200 bg-sand-100">
                        <SkeletonImage
                          src={loc1.image.src}
                          alt={loc1.image.alt}
                          width={64}
                          height={64}
                          className="size-full"
                          imgClassName="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={locationPath(loc1.slug)}
                          className="inline-flex items-center gap-1 truncate text-xs font-semibold text-accent-700 hover:text-accent-800"
                        >
                          About {loc1.name}
                          <Icon name="arrow-right" className="size-3" strokeWidth={2.2} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Location 2 Selector */}
                <div>
                  <label htmlFor={select2Id} className="block text-xs font-semibold text-ink-500 mb-1.5">
                    Location B
                  </label>
                  <div className="relative">
                    <select
                      id={select2Id}
                      value={loc2Slug}
                      onChange={(e) => setLoc2Slug(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-sand-300 bg-sand-50/60 px-3 py-2.5 pr-8 text-sm font-bold text-ink-900 shadow-2xs focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.slug}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                    <Icon
                      name="chevron-down"
                      className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-400"
                    />
                  </div>
                  {loc2 && (
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="size-8 shrink-0 overflow-hidden rounded-lg border border-sand-200 bg-sand-100">
                        <SkeletonImage
                          src={loc2.image.src}
                          alt={loc2.image.alt}
                          width={64}
                          height={64}
                          className="size-full"
                          imgClassName="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={locationPath(loc2.slug)}
                          className="inline-flex items-center gap-1 truncate text-xs font-semibold text-accent-700 hover:text-accent-800"
                        >
                          About {loc2.name}
                          <Icon name="arrow-right" className="size-3" strokeWidth={2.2} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Attributes Comparison List */}
              <div className="mt-5 divide-y divide-sand-100">
                {rows.map((row) => {
                  const cell1 = row.cells.find((c) => c.locationId === loc1Slug)
                  const desc1 = cell1?.descriptor ?? 'moderate'
                  const cell2 = row.cells.find((c) => c.locationId === loc2Slug)
                  const desc2 = cell2?.descriptor ?? 'moderate'

                  return (
                    <div key={row.attribute.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-tint-50 text-accent-600">
                          <Icon name={row.attribute.icon} className="size-3.5" strokeWidth={2} />
                        </span>
                        <h4 className="font-display text-sm font-bold text-ink-900">
                          {row.attribute.label}
                        </h4>
                      </div>
                      <p className="mt-1 text-xs text-ink-500 leading-relaxed pl-8">
                        {row.attribute.description}
                      </p>

                      {/* 2-column side-by-side badges */}
                      <div className="mt-3 grid grid-cols-2 gap-3 pl-8">
                        <div className="flex items-center">
                          <DescriptorBadge descriptor={desc1} />
                        </div>
                        <div className="flex items-center">
                          <DescriptorBadge descriptor={desc2} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Full Matrix Table View (Always on desktop, toggleable on mobile/tablet)  */}
        {/* ========================================================================= */}
        <div className={cn(mobileView === 'compare' ? 'hidden lg:block' : 'block')}>
          <div className="mt-8 lg:mt-12">
            <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-xs">
              {/* Optional horizontal scroll cue on touch devices */}
              <div className="border-b border-sand-100 bg-sand-50/60 px-4 py-2 text-xs text-ink-500 lg:hidden flex items-center justify-between">
                <span>Swipe horizontally to view all areas</span>
                <span className="inline-flex items-center gap-1 font-semibold text-accent-700">
                  Scroll <Icon name="arrow-right" className="size-3.5" />
                </span>
              </div>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[50rem] border-collapse text-left">
                  <caption className="sr-only">
                    General comparison of Lagos areas across {rows.length} attributes
                  </caption>

                  <thead>
                    <tr className="border-b border-sand-200 bg-sand-50/80">
                      <th
                        scope="col"
                        className="sticky left-0 z-20 w-52 bg-sand-50/95 backdrop-blur-xs px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink-700 sm:w-60"
                      >
                        Location
                      </th>
                      {rows.map((row) => (
                        <th
                          key={row.attribute.id}
                          scope="col"
                          className="min-w-[10rem] px-5 py-4 align-top"
                        >
                          <div className="flex items-center gap-1.5 font-display text-sm font-bold text-ink-900">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-tint-50 text-accent-600">
                              <Icon name={row.attribute.icon} className="size-3.5" strokeWidth={2} />
                            </span>
                            <span>{row.attribute.label}</span>
                          </div>
                          <span className="mt-1 block text-xs font-normal leading-relaxed text-ink-500">
                            {row.attribute.description}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-sand-200/80">
                    {locations.map((location) => (
                      <tr
                        key={location.id}
                        className="group transition-colors duration-200 hover:bg-tint-50/60"
                      >
                        {/* Sticky location header column */}
                        <th
                          scope="row"
                          className="sticky left-0 z-10 bg-white px-5 py-4 text-left align-middle font-normal transition-colors group-hover:bg-tint-50/90"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-11 shrink-0 overflow-hidden rounded-xl border border-sand-200 bg-sand-100 shadow-2xs">
                              <SkeletonImage
                                src={location.image.src}
                                alt={location.image.alt}
                                width={88}
                                height={88}
                                className="size-full"
                                imgClassName="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="min-w-0">
                              <Link
                                to={locationPath(location.slug)}
                                className="font-display text-base font-bold text-ink-900 transition-colors duration-200 hover:text-accent-600 flex items-center gap-1"
                              >
                                <span className="truncate">{location.name}</span>
                                <Icon name="arrow-up-right" className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-accent-600" />
                              </Link>
                              <span className="mt-0.5 block truncate text-xs text-ink-500">
                                {location.regionLabel}
                              </span>
                            </div>
                          </div>
                        </th>

                        {/* Attribute Cells */}
                        {rows.map((row) => {
                          const cell = row.cells.find((entry) => entry.locationId === location.slug)
                          const descriptor: LocationComparisonDescriptor = cell?.descriptor ?? 'moderate'

                          return (
                            <td
                              key={`${row.attribute.id}-${location.id}`}
                              className="px-5 py-4 align-middle"
                            >
                              <DescriptorBadge descriptor={descriptor} />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Legend & Contextual Guidance                                             */}
        {/* ========================================================================= */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-sand-200/80 bg-white/70 p-4.5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-ink-700">Indicator legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-emerald-600" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-emerald-600" />
                <span className="size-1.5 rounded-full bg-emerald-600" />
                <span className="size-1.5 rounded-full bg-emerald-600" />
              </span>
              <span className="font-semibold text-emerald-800">Strong:</span>
              <span className="text-ink-500">Defining area strength</span>
            </div>
            <span className="text-sand-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-amber-500" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span className="size-1.5 rounded-full bg-amber-500" />
                <span className="size-1.5 rounded-full bg-sand-300/60" />
              </span>
              <span className="font-semibold text-amber-800">Moderate:</span>
              <span className="text-ink-500">Available / varies by estate</span>
            </div>
            <span className="text-sand-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-ink-400" aria-hidden="true">
                <span className="size-1.5 rounded-full bg-ink-400" />
                <span className="size-1.5 rounded-full bg-sand-300/60" />
                <span className="size-1.5 rounded-full bg-sand-300/60" />
              </span>
              <span className="font-semibold text-ink-600">Limited:</span>
              <span className="text-ink-500">Less prevalent here</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-400 max-w-md">
            General guidance only. Individual schemes and streets differ.
          </p>
        </div>
      </Container>
    </Section>
  )
}
