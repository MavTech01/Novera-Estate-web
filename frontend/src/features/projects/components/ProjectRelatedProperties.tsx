import { PropertyCard } from '@/components/properties/PropertyCard'
import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { Project } from '@/features/projects/types/projectTypes'
import { useRelatedProperties } from '@/features/projects/hooks/useRelatedProperties'

interface ProjectRelatedPropertiesProps {
  project: Project
}

/**
 * "You May Also Like" — resale listings near the development.
 *
 * Optional by design: if the repository has nothing plausible for this location
 * and project type, the section renders nothing rather than showing an empty grid
 * or, worse, unrelated stock. Mounting the hook is unconditional because hooks
 * cannot be skipped, but the markup is.
 */
export function ProjectRelatedProperties({ project }: ProjectRelatedPropertiesProps) {
  const { properties, isLoading } = useRelatedProperties({ project })

  if (isLoading || properties.length === 0) return null

  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Nearby listings"
          title="You May Also Like"
          description={`Other properties listed in ${project.location}, from the resale catalogue.`}
        />

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, index) => (
            <li key={property.id}>
              <Reveal delay={index * 80} className="h-full">
                <PropertyCard property={property} index={index} className="h-full" />
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-ink-400">
          These are separate resale listings nearby, not units within {project.name}.
        </p>
      </Container>
    </Section>
  )
}
