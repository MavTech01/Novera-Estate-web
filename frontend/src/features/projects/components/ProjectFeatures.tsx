import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { Project } from '@/features/projects/types/projectTypes'

/** Icons cycled across the feature list, so the grid does not repeat a glyph. */
const FEATURE_ICONS = [
  'building-2',
  'layers',
  'navigation',
  'trees',
  'shield-check',
  'car',
  'users',
  'sparkles',
] as const

/**
 * "Development Features" — the design and build characteristics of one scheme.
 *
 * The copy comes from `project.features`; the icons are positional decoration,
 * so a feature whose wording changes does not need a matching icon update.
 */
export function ProjectFeatures({ project }: { project: Project }) {
  if (project.features.length === 0) return null

  return (
    <Section tone="warm">
      <Container>
        <SectionHeading
          eyebrow="How it is built"
          title="Development Features"
          description="What distinguishes this scheme from a standard build."
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {project.features.map((feature, index) => (
            <li key={feature}>
              <Reveal
                delay={(index % 4) * 70}
                className="group flex h-full items-start gap-3.5 rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent-200 hover:shadow-md"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-tint-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                  <Icon name={FEATURE_ICONS[index % FEATURE_ICONS.length]} className="size-5" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold leading-relaxed text-ink-700">{feature}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
