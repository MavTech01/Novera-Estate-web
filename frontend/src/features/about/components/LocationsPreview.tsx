import { Link } from 'react-router-dom'
import { useAllLocations } from '@/features/locations'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { locationPath, routes } from '@/shared/lib/routes'

/**
 * "Locations We Serve" — the About page's route into the Locations feature.
 *
 * Reads the same records the locations page renders, via `useAllLocations`, and
 * links to the same `/locations/:slug` pages. Nothing about an area is
 * restated here, so an area edited in one place is corrected in both.
 *
 * The tile is a compact link rather than a second `LocationCard`: that card is
 * built for the catalogue grid, where a visitor is comparing results. Here the
 * job is orientation, and six full-bleed cards with sample counts would
 * overstate how much inventory we have while burying the link onward.
 *
 * Areas appear in catalogue order and are deliberately not ranked — there is no
 * data to rank them by, and implying a best area would be a claim we cannot
 * support.
 */
export function LocationsPreview() {
  const { value: locations, status } = useAllLocations()

  return (
    <Section tone="tint">
      <Container>
        <SectionHeading
          eyebrow="Where we work"
          title="Locations We Serve"
          description="We work across six Lagos areas. Pick one to see what is there and how the area compares."
          action={
            <ButtonLink href={routes.locations} variant="outline" size="md" withArrow>
              Explore All Locations
            </ButtonLink>
          }
        />

        {status === 'success' && locations.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {locations.map((location, index) => (
              <li key={location.id} className="flex">
                <Reveal
                  delay={(index % 3) * 70}
                  className="group relative flex w-full items-center gap-4 rounded-xl border border-sand-200 bg-white px-5 py-4 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-accent-200 hover:shadow-md focus-within:-translate-y-0.5 focus-within:shadow-md"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-tint-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                    <Icon name="map-pin" className="size-5" strokeWidth={2} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold text-ink-900">
                      <Link
                        to={locationPath(location.slug)}
                        className="transition-colors duration-200 after:absolute after:inset-0 after:content-[''] hover:text-accent-700 focus-visible:outline-none"
                      >
                        {location.name}
                        <span className="sr-only"> — explore this location</span>
                      </Link>
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-ink-500">{location.regionLabel}</p>
                  </div>

                  <Icon
                    name="arrow-right"
                    className="arrow-nudge size-4 shrink-0 text-ink-400 transition-colors duration-200 group-hover:text-accent-600"
                    strokeWidth={2.2}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          /* Shown while the catalogue resolves and if it fails outright — the
             link to the locations page is still the useful next step either way,
             so this never leaves the visitor at a dead end. */
          <p className="mt-12 rounded-xl border border-dashed border-sand-300 bg-white p-10 text-center text-sm text-ink-500">
            Our areas are loading. You can browse them all on the locations page.
          </p>
        )}
      </Container>
    </Section>
  )
}