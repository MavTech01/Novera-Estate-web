import { Container } from '@/shared/components/ui/Container'
import { FloatingBackground } from '@/shared/components/layout/FloatingBackground'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import type { Project } from '@/features/projects/types/projectTypes'
import { ProjectProgress } from './ProjectProgress'

/**
 * "About the Development" — the long-form description, the two facts worth
 * pulling out of it, and the construction progress panel where there is one.
 *
 * The copy and the two tiles are side by side rather than stacked, because the
 * tiles are short and the copy is long: as a full-width row underneath they read
 * as a footnote to a mostly-empty band.
 *
 * The section used to fall back to `max-w-3xl` for a scheme that is not under
 * construction, which left two thirds of a 1200px container empty. Progress
 * still only appears for `ongoing` schemes, but it now sits *below* both columns
 * at full width, so a scheme with no progress panel has no hole where one would
 * have been.
 */
export function ProjectDescription({ project }: { project: Project }) {
  const hasProgress = project.status === 'ongoing'

  return (
    <Section
      id="project-about"
      ariaLabelledBy="project-about-heading"
      tone="tint"
      contained
      className="relative isolate overflow-hidden"
    >
      {/* Decoration only: behind the content, never above it, and inert. */}
      <FloatingBackground orbCount={4} shapeCount={4} className="-inset-x-6 -inset-y-8 sm:-inset-x-8" />

      <div className="relative z-10">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <h2
                id="project-about-heading"
                className="font-display text-2xl leading-tight text-ink-900 sm:text-3xl"
              >
                About the Development
              </h2>

              {/*
                `measure`-ish: a hard cap in ch rather than a percentage, so the
                line length is the same at 768px and at 1440px.
              */}
              <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-ink-600">
                {project.description}
              </p>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-5">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <InfoTile label="Designed for" value={designedFor(project)} />
                <InfoTile
                  label="Scheme Size"
                  value={`${project.totalUnits} units across ${project.developmentSize}`}
                />
              </dl>
            </Reveal>
          </div>

          {hasProgress && (
            <Reveal delay={160} className="mt-10">
              <ProjectProgress project={project} variant="detailed" />
            </Reveal>
          )}

          {/*
            Deliberately absent: any claim about appreciation, rental yield or
            investment return. A development description should not imply a
            financial outcome we cannot support.
          */}
          <p className="mt-10 flex items-start gap-2 border-t border-sand-200 pt-5 text-xs leading-relaxed text-ink-400">
            <Icon name="file-text" className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
            <span>
              Demonstration content for a fictional development. Figures and imagery do not represent a live
              Novera Estates scheme.
            </span>
          </p>
        </Container>
      </div>
    </Section>
  )
}

/** One of the two pulled-out facts. */
function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-600">{label}</dt>
      <dd className="mt-1.5 text-sm font-semibold leading-relaxed text-ink-900">{value}</dd>
    </div>
  )
}

/** The audience, phrased per scheme type. */
function designedFor(project: Project): string {
  if (project.projectType === 'commercial') return 'Businesses wanting a visible Lagos address'
  if (project.projectType === 'mixed-use') return 'Live, work and everyday services in one place'
  return 'Families and professionals buying to live'
}
