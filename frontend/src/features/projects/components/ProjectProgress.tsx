import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import { formatDate } from '@/shared/lib/format'
import type { IconName } from '@/types'
import type { Project, ProjectStatus } from '@/features/projects/types/projectTypes'
import { getProjectProgressPercent } from '@/features/projects/utils/projectUtils'

interface ProjectProgressProps {
  project: Project
  /**
   * `compact` is the single bar used on cards; `detailed` is the full panel with
   * milestones, used on the detail page.
   *
   * The panel renders for every status but shows different content: a live bar
   * for a scheme under construction, a completion summary for a finished one,
   * and launch information for one that has not broken ground.
   */
  variant?: 'compact' | 'detailed'
  className?: string
}

interface Milestone {
  id: string
  label: string
  value: string
  icon: IconName
}

/** Only meaningful while a development is `ongoing`. */
function getMilestones(project: Project): Milestone[] {
  return [
    {
      id: 'started',
      label: 'Construction Started',
      value: project.constructionStarted ? formatDate(project.constructionStarted) : 'Not yet started',
      icon: 'construction',
    },
    {
      id: 'progress',
      label: 'Current Progress',
      value: `${getProjectProgressPercent(project) ?? 0}%`,
      icon: 'trending-up',
    },
    {
      id: 'completion',
      label: 'Expected Completion',
      value: formatDate(project.completionDate),
      icon: 'calendar-check',
    },
  ]
}

/** Facts shown for a finished scheme, where there is no bar left to fill. */
function getCompletionMilestones(project: Project): Milestone[] {
  return [
    {
      id: 'started',
      label: 'Construction Started',
      value: project.constructionStarted ? formatDate(project.constructionStarted) : '—',
      icon: 'construction',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: formatDate(project.completionDate),
      icon: 'check-circle',
    },
    {
      id: 'units',
      label: 'Units Delivered',
      value:
        project.unitsCompleted === null
          ? `${project.totalUnits.toLocaleString('en-NG')} total`
          : `${project.unitsCompleted.toLocaleString('en-NG')} of ${project.totalUnits.toLocaleString('en-NG')}`,
      icon: 'building-2',
    },
  ]
}

/** Facts shown before site works begin. */
function getLaunchMilestones(project: Project): Milestone[] {
  return [
    {
      id: 'planning',
      label: 'Development Stage',
      value: 'Pre-construction',
      icon: 'hard-hat',
    },
    {
      id: 'units',
      label: 'Units Planned',
      value: project.totalUnits.toLocaleString('en-NG'),
      icon: 'building-2',
    },
    {
      id: 'launch',
      label: 'Target Completion',
      value: formatDate(project.completionDate),
      icon: 'calendar-check',
    },
  ]
}

function milestonesForStatus(project: Project): Milestone[] {
  if (project.status === 'completed') return getCompletionMilestones(project)
  if (project.status === 'upcoming') return getLaunchMilestones(project)
  return getMilestones(project)
}

/** Heading and supporting line per status, so the panel never reads as a template. */
const STATUS_COPY: Record<ProjectStatus, { title: string; note: string }> = {
  ongoing: {
    title: 'Development Progress',
    note: 'Progress is reported at construction milestones and updated as site works complete.',
  },
  completed: {
    title: 'Development Complete',
    note: 'This scheme has been completed and handed over.',
  },
  upcoming: {
    title: 'Development Information',
    note: 'Site works have not yet begun. Details below describe the planned scheme.',
  },
}

/**
 * Live construction progress, adapting to the project's status.
 *
 * A progress bar on a finished building would be misleading and a bar on a scheme
 * that has not broken ground would be meaningless, so only `ongoing` renders one.
 * The other two statuses get the same panel with figures that describe them
 * accurately instead.
 */
export function ProjectProgress({ project, variant = 'compact', className }: ProjectProgressProps) {
  const percent = getProjectProgressPercent(project)

  // Cards show only the bar, and only where there is a bar to show.
  if (variant === 'compact') {
    if (percent === null) return null

    return (
      <div className={className}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
            Development progress
          </span>
          <span className="text-xs font-bold text-ink-900">{percent}% complete</span>
        </div>

        <div
          role="progressbar"
          aria-label={`${project.name} construction progress`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${percent}% complete`}
          className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-sand-200"
        >
          <div
            className="h-full rounded-pill bg-accent-500 transition-[width] duration-700 ease-[var(--ease-out-soft)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    )
  }

  const copy = STATUS_COPY[project.status]

  return (
    <div className={cn('rounded-xl border border-sand-200 bg-white p-5 shadow-sm sm:p-6', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-base text-ink-900">{copy.title}</h3>

        {percent !== null && (
          <p className="text-sm font-bold text-accent-700">{percent}% Complete</p>
        )}

        {project.status === 'completed' && (
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-success-600">
            <Icon name="check-circle" className="size-4" strokeWidth={2.2} />
            Delivered
          </p>
        )}

        {project.status === 'upcoming' && (
          <p className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-600">
            <Icon name="hard-hat" className="size-4" strokeWidth={2.2} />
            Pre-construction
          </p>
        )}
      </div>

      {percent !== null && (
        <div
          role="progressbar"
          aria-label={`${project.name} construction progress`}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${percent}% complete`}
          className="mt-4 h-2 w-full overflow-hidden rounded-pill bg-sand-200"
        >
          <div
            className="h-full rounded-pill bg-accent-500 transition-[width] duration-700 ease-[var(--ease-out-soft)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-500">{copy.note}</p>

      <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-sand-200 pt-5 sm:grid-cols-3 sm:gap-3">
        {milestonesForStatus(project).map((milestone) => (
          <div key={milestone.id}>
            <dt className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
              <Icon name={milestone.icon} className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
              {milestone.label}
            </dt>
            <dd className="mt-1.5 text-sm font-semibold text-ink-900">{milestone.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
