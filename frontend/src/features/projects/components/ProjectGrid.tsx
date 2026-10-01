import { cn } from '@/shared/lib/cn'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/features/projects/types/projectTypes'

interface ProjectGridProps {
  projects: Project[]
  /** Announced while the grid swaps, e.g. "Showing 4 developments". */
  label?: string
  /** Merged with the layout classes, so callers can add state styling only. */
  className?: string
}

/**
 * Responsive development grid: three columns on desktop, two on tablet, one on
 * mobile. Each card is a list item so assistive tech announces "N of M"
 * correctly, and the entrance stagger is driven by the card's own index.
 */
export function ProjectGrid({ projects, label, className }: ProjectGridProps) {
  return (
    <ul
      aria-label={label ?? 'Property developments'}
      className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7', className)}
    >
      {projects.map((project, index) => (
        <li key={project.id} className="flex">
          <ProjectCard project={project} index={index % 6} />
        </li>
      ))}
    </ul>
  )
}
