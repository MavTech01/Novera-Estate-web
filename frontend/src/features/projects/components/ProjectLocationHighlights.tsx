import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { Project } from '@/features/projects/types/projectTypes'

/**
 * "Connected to What Matters" — why this location suits the scheme.
 *
 * Written as observable characteristics of the neighbourhood rather than
 * superlatives: nothing here promises appreciation, shortened commutes or
 * guaranteed access, because none of those are ours to assert.
 */
export function ProjectLocationHighlights({ project }: { project: Project }) {
  const { highlights } = project.locationInfo

  if (highlights.length === 0) return null

  return (
    <Section tone="brown" spacing="tight">
      <Container>
        <SectionHeading
          eyebrow="Why here"
          title="Connected to What Matters"
          description={`What ${project.location} is generally like, and why the scheme is sited here.`}
          tone="onBrown"
        />

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <li key={highlight.id}>
              <Reveal
                delay={index * 90}
                className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.06] p-6"
              >
                <span className="flex size-12 items-center justify-center rounded-pill bg-white/10 text-accent-300">
                  <Icon name={highlight.icon} className="size-6" strokeWidth={1.75} />
                </span>

                <h3 className="mt-5 font-display text-base text-white">{highlight.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{highlight.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
