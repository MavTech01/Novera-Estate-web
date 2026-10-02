import { Link } from 'react-router-dom'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { cn } from '@/shared/lib/cn'
import { formatCurrency } from '@/shared/lib/format'
import { projectPath } from '@/shared/lib/routes'
import { projectTypeShortLabels } from '@/features/projects/data/projectOptions'
import type { Project } from '@/features/projects/types/projectTypes'
import { formatAvailableUnits } from '@/features/projects/utils/projectUtils'
import { ProjectProgress } from './ProjectProgress'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface ProjectCardProps {
  project: Project
  /** Stagger index — the grid feeds it to the entrance animation. */
  index?: number
  className?: string
}

/**
 * A single development card.
 *
 * The title link stretches across the whole card so the entire surface is
 * tappable on mobile, which is why the "View Project" cue at the bottom is
 * decorative rather than a second link to the same place.
 */
export function ProjectCard({ project, index = 0, className }: ProjectCardProps) {
  const href = projectPath(project.slug)
  const cover = project.images[0]

  return (
    <article
      className={cn(
        'card-stagger group relative flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white',
        'shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)]',
        'hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lg',
        'focus-within:-translate-y-1.5 focus-within:shadow-lg',
        className,
      )}
      style={{ '--stagger-index': index } as React.CSSProperties}
    >
      <div className="relative aspect-[4/3] bg-tint-100">
        <SkeletonImage
          src={cover?.src ?? ''}
          alt={cover?.alt ?? `${project.name} in ${project.location}`}
          width={900}
          height={675}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />

        {/* Scrim keeps the pills legible over lighter photography. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink-900/45 to-transparent"
        />

        <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-start gap-1.5 p-3.5">
          <ProjectStatusBadge status={project.status} variant="overlay" />
          {project.isFeatured && (
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <Icon name="sparkles" className="size-3.5" strokeWidth={2} />
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
          <Icon name="map-pin" className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
          <span className="truncate">{project.location}</span>
        </p>

        <h3 className="mt-2 font-display text-lg leading-snug text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <Link to={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {project.name}
            <span className="sr-only"> — view project</span>
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{project.summary}</p>

        <div className="mt-4 border-t border-sand-200 pt-4">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">Starting price</p>
          <p className="mt-1 font-display text-lg font-bold leading-none text-ink-900">
            <span className="text-sm font-semibold text-ink-500">From </span>
            {formatCurrency(project.startingPrice)}
          </p>
          <p className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-ink-600">
            <Icon name="building-2" className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
            {formatAvailableUnits(project.availableUnits)}
          </p>
        </div>

        <div className="mt-4">
          <ProjectProgress project={project} variant="compact" />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-sand-200 pt-4">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-accent-600">
            {projectTypeShortLabels[project.projectType]}
          </span>

          {/* The stretched title link already makes the card clickable. */}
          <span
            aria-hidden
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors duration-200 group-hover:text-accent-700"
          >
            View Project
            <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </article>
  )
}
