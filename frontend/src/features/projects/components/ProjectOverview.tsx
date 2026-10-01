import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { projectStatusLabels, projectTypeLabels } from '@/features/projects/data/projectOptions'
import type { IconName } from '@/types'
import type { Project } from '@/features/projects/types/projectTypes'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface ProjectOverviewProps {
  project: Project
}

/**
 * "Project Overview" — the specification grid.
 *
 * The completion row is worded per status rather than always saying "Expected
 * Completion": a finished scheme has a handover date, not an expectation, and an
 * upcoming one is closer to a target than a commitment.
 */
export function ProjectOverview({ project }: ProjectOverviewProps) {
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

  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="At a glance"
          title="Project Overview"
          description="The figures below are demonstration data for a fictional development."
          action={<ProjectStatusBadge status={project.status} />}
        />

        <Reveal className="mt-10 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm">
          <dl className="grid grid-cols-2 gap-px bg-sand-200 sm:grid-cols-3 lg:grid-cols-4">
            {rows.map((row) => (
              <div key={row.id} className="bg-white p-5 sm:p-6">
                <dt className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                  <Icon name={row.icon} className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
                  <span className="truncate">{row.label}</span>
                </dt>
                <dd className="mt-2 font-display text-base font-bold leading-snug text-ink-900 sm:text-lg">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </Section>
  )
}
