import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { featuredLocations } from '@/data/locations'
import { countProjectsByLocation } from '@/features/projects/utils/projectUtils'
import { ProjectLocationCard } from './ProjectLocationCard'
import { projects } from '@/features/projects/data/projects'

/**
 * "Prime Locations" — the neighbourhoods we develop in, each linking into the
 * catalogue already filtered to that area.
 *
 * Counts come from the project records rather than being hardcoded, so the
 * badges stay truthful once the API replaces the mock data.
 */
export function PrimeLocations() {
  const counts = countProjectsByLocation(projects)

  return (
    <Section tone="tint">
      <Container>
        <SectionHeading
          eyebrow="Where we build"
          title="Prime Locations"
          description="From established corridors to emerging growth areas — explore the neighbourhoods where our developments sit."
        />

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {featuredLocations.map((location, index) => (
            <Reveal as="li" key={location.id} delay={(index % 3) * 100} className="flex">
              <ProjectLocationCard location={location} projectCount={counts.get(location.slug) ?? 0} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}