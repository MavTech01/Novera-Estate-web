import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import type { Project } from '@/features/projects/types/projectTypes'
import { ProjectProgress } from './ProjectProgress'

/**
 * "About the Development" alongside the status-aware progress panel.
 *
 * The two sit together because progress is only interesting next to the
 * description — and because `ProjectProgress` collapses to nothing for schemes
 * that are not under construction, which keeps this row balanced either way.
 */
export function ProjectDescription({ project }: { project: Project }) {
  const hasProgress = project.status === 'ongoing'

  return (
    <Section tone="tint">
      <Container>
        <div
          className={
            hasProgress
              ? 'grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-14'
              : 'max-w-3xl'
          }
        >
          <Reveal>
            <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">About the Development</h2>

            <p className="mt-5 text-base leading-relaxed text-ink-500">{project.description}</p>

            <dl className="mt-8 grid grid-cols-1 gap-5 border-t border-sand-200 pt-7 sm:grid-cols-2">
              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                  Designed for
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-ink-900">
                  {project.projectType === 'commercial'
                    ? 'Businesses wanting a visible Lagos address'
                    : project.projectType === 'mixed-use'
                      ? 'Live, work and everyday services in one place'
                      : 'Families and professionals buying to live'}
                </dd>
              </div>

              <div>
                <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                  Scheme size
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-ink-900">
                  {project.totalUnits} units across {project.developmentSize}
                </dd>
              </div>
            </dl>

            {/*
              Deliberately absent: any claim about appreciation, rental yield or
              investment return. A development description should not imply a
              financial outcome we cannot support.
            */}
            <p className="mt-6 flex items-start gap-2.5 rounded-md border border-sand-200 bg-white/70 px-4 py-3 text-xs leading-relaxed text-ink-500">
              <Icon name="file-text" className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
              <span>
                Figures and imagery on this page are demonstration content for a fictional development and do
                not represent a live Novera Estates scheme.
              </span>
            </p>
          </Reveal>

          {hasProgress && (
            <Reveal delay={120}>
              <ProjectProgress project={project} variant="detailed" />
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  )
}
