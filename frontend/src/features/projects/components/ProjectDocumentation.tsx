import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { Project } from '@/features/projects/types/projectTypes'

/**
 * "Project Information" — documentation status.
 *
 * Every value reads "available upon request" rather than naming a registered
 * title or approval number, and the caveat is given visual prominence. A
 * development page that appeared to confirm documentation it has not seen would
 * be worse than one that simply says so.
 */
export function ProjectDocumentation({ project }: { project: Project }) {
  const { documentation } = project

  return (
    <Section tone="white" spacing="tight">
      <Container>
        <SectionHeading
          eyebrow="Due diligence"
          title="Project Information"
          description="Documentation information for this development."
        />

        <Reveal className="mt-10 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
          <div className="border-b border-sand-200 bg-sand-100 px-5 py-4 sm:px-6">
            <p className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-600">
              <Icon name="shield-check" className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
              <span>{documentation.note}</span>
            </p>
          </div>

          <dl className="grid grid-cols-1 gap-px bg-sand-200 sm:grid-cols-2">
            {documentation.entries.map((entry) => (
              <div key={entry.id} className="flex items-baseline justify-between gap-4 bg-white px-5 py-4 sm:px-6">
                <dt className="text-sm font-semibold text-ink-700">{entry.label}</dt>
                <dd className="text-right text-sm text-ink-500">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </Section>
  )
}
