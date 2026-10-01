import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { projectAmenityById } from '@/features/projects/data/projectContent'
import type { Project } from '@/features/projects/types/projectTypes'

interface ProjectAmenitiesProps {
  project: Project
}

/**
 * "Development Amenities" — what this scheme specifically provides.
 *
 * Reads the project's own `amenities` keys through the shared metadata map, so a
 * key with no metadata is skipped rather than rendered as an unlabelled tile.
 *
 * Per-development rather than site-wide, so it belongs to the Projects feature
 * and takes the project as a prop instead of importing a fixed list.
 */
export function ProjectAmenities({ project }: ProjectAmenitiesProps) {
  const amenities = project.amenities
    .map((amenity) => projectAmenityById.get(amenity))
    .filter((amenity) => amenity !== undefined)

  if (amenities.length === 0) return null

  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="On site"
          title="Development Amenities"
          description="Planned into the scheme rather than promised as a later addition."
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity, index) => (
            <li key={amenity.id}>
              <Reveal
                delay={(index % 3) * 70}
                className="flex h-full items-start gap-4 rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent-200 hover:shadow-md"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-tint-50 text-accent-600">
                  <Icon name={amenity.icon} className="size-5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-sm font-bold text-ink-900">{amenity.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-500">
                    {amenity.description}
                  </span>
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
