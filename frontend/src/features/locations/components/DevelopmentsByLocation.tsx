import { useMemo } from 'react'

import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { Link } from '@/shared/components/ui/Link'
import { ProjectCard, type Project } from '@/features/projects'
import { locationPath, routes } from '@/shared/lib/routes'
import type { Location } from '@/features/locations/types/locationTypes'

interface DevelopmentsByLocationProps {
  locations: Location[]
  /** The Projects feature's catalogue, grouped here rather than duplicated. */
  projects: Project[]
  className?: string
}

/** How many developments to show per area before linking to the rest. */
const MAX_PER_LOCATION = 2

/**
 * "Developments by Location" — the developments we hold, grouped under the area
 * they sit in.
 *
 * Reuses `ProjectCard` unchanged rather than defining a second card for this
 * page: a development is a development, and a bespoke card here would drift from
 * the one on `/projects` the first time either was edited.
 *
 * The grouping is the one piece of logic this section owns, because grouping by
 * *area* is a locations concern — Lekki spans several of the catalogue's
 * location slugs, and that mapping lives with the location records.
 */
export function DevelopmentsByLocation({ locations, projects, className }: DevelopmentsByLocationProps) {
  const grouped = useMemo(
    () =>
      locations
        .map((location) => {
          const slugs = new Set(location.propertyLocationSlugs)
          const inArea = projects.filter((project) => slugs.has(project.locationSlug))

          return { location, projects: inArea.slice(0, MAX_PER_LOCATION), total: inArea.length }
        })
        .filter((group) => group.total > 0),
    [locations, projects],
  )

  if (grouped.length === 0) return null

  return (
    <Section tone="white" className={className}>
      <Container>
        <SectionHeading
          eyebrow="Our developments"
          title="Developments by Location"
          description="The developments we currently hold, grouped by the area they sit in. Each links to the full scheme details."
        />

        <div className="mt-10 space-y-12 lg:mt-14 lg:space-y-16">
          {grouped.map(({ location, projects: areaProjects, total }) => (
            <Reveal key={location.id}>
              <section aria-labelledby={`developments-${location.slug}`}>
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand-200 pb-5">
                  <div>
                    <h3
                      id={`developments-${location.slug}`}
                      className="flex items-center gap-2 font-display text-xl text-ink-900 sm:text-2xl"
                    >
                      <Icon name="map-pin" className="size-5 shrink-0 text-accent-500" strokeWidth={2} />
                      {location.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-500">
                      {total} {total === 1 ? 'development' : 'developments'} in {location.regionLabel}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {total > MAX_PER_LOCATION && (
                      <Link
                        href={`/projects?location=${location.propertyLocationSlugs[0]}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 transition-colors duration-200 hover:text-accent-700"
                      >
                        All {total} developments
                        <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
                      </Link>
                    )}
                    <Link
                      href={locationPath(location.slug)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 transition-colors duration-200 hover:text-accent-700"
                    >
                      About {location.name}
                      <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
                    </Link>
                  </div>
                </div>

                <ul className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-7">
                  {areaProjects.map((project) => (
                    <li key={project.id} className="flex">
                      <ProjectCard project={project} />
                    </li>
                  ))}
                </ul>

                {total > areaProjects.length && (
                  <div className="mt-6 sm:hidden">
                    <ButtonLink href={`/projects?location=${location.propertyLocationSlugs[0]}`} variant="soft" size="sm">
                      View all {total} developments in {location.name}
                    </ButtonLink>
                  </div>
                )}
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-ink-500">
            Looking for homes in a specific area? Browse the full properties catalogue.
          </p>
          <ButtonLink href={routes.properties} variant="outline">
            Explore Properties
          </ButtonLink>
        </Reveal>
      </Container>
    </Section>
  )
}
