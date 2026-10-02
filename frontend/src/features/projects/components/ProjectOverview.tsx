import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { cn } from '@/shared/lib/cn'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { projectStatusLabels, projectTypeLabels } from '@/features/projects/data/projectOptions'
import type { IconName } from '@/types'
import type { Project } from '@/features/projects/types/projectTypes'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface ProjectOverviewProps {
  project: Project
  /**
   * Render as a panel inside the detail page's main column rather than a
   * full-width band. The specification grid drops to two columns, because a
   * sidebar has already taken a third of the rail.
   */
  contained?: boolean
}

/**
 * "Project Overview" — the specification grid.
 *
 * The completion row is worded per status rather than always saying "Expected
 * Completion": a finished scheme has a handover date, not an expectation, and an
 * upcoming one is closer to a target than a commitment.
 */
export function ProjectOverview({ project, contained = false }: ProjectOverviewProps) {
  const completionLabel =
    project.status === 'completed'
      ? 'Completed'
      : project.status === 'ongoing'
        ? 'Expected Completion'
        : 'Target Completion'

  const rows: { id: string; label: string; value: string; icon: IconName }[] = [
    { id: 'type', label: 'Project Type', value: projectTypeLabels[project.projectType], icon: 'building-2' },
    { id: 'location', label: 'Location', value: project.location, icon: 'map-pin' },
    {
      id: 'status',
      label: 'Status',
      value: projectStatusLabels[project.status],
      icon: project.status === 'ongoing' ? 'construction' : project.status === 'completed' ? 'check-circle' : 'calendar-check',
    },
    { id: 'total-units', label: 'Total Units', value: project.totalUnits.toLocaleString('en-NG'), icon: 'building' },
    {
      id: 'available-units',
      label: 'Available Units',
      value: project.availableUnits > 0 ? project.availableUnits.toLocaleString('en-NG') : 'Fully allocated',
      icon: 'key',
    },
    {
      id: 'starting-price',
      label: 'Starting Price',
      value: `From ${formatCurrency(project.startingPrice)}`,
      icon: 'trending-up',
    },
    { id: 'completion', label: completionLabel, value: formatDate(project.completionDate), icon: 'calendar-check' },
    { id: 'size', label: 'Development Size', value: project.developmentSize, icon: 'ruler' },
  ]

  const content = (
    <>
      <SectionHeading
        eyebrow="At a glance"
        title="Project Overview"
        action={<ProjectStatusBadge status={project.status} />}
      />

      <Reveal className="mt-8 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
        <dl
          className={cn(
            'grid gap-px bg-sand-200',
            // Inside the main column the grid is narrower, so it stays at two
            // across rather than opening out to four.
            contained ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
          )}
        >
          {rows.map((row) => (
            <div key={row.id} className="bg-white p-4 sm:p-5">
              <dt className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                <Icon name={row.icon} className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
                <span className="truncate">{row.label}</span>
              </dt>
              <dd className="mt-2 font-display text-sm font-bold leading-snug text-ink-900 sm:text-base">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </>
  )

  if (contained) {
    return (
      <Section tone="white" contained>
        {content}
      </Section>
    )
  }

  return (
    <Section tone="white">
      <Container>{content}</Container>
    </Section>
  )
}
