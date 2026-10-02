import { Link } from 'react-router-dom'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { cn } from '@/shared/lib/cn'
import { defaultProjectFilters, serialiseProjectFilters } from '@/features/projects/utils/projectUtils'

interface ProjectLocationCardProps {
  location: {
    id: string
    slug: string
    name: string
    description: string
    image: { src: string; alt: string }
  }
  /** How many developments this location currently has, as a filter string. */
  projectCount: number
  className?: string
}

/**
 * A prime location, linking into the catalogue pre-filtered to that area.
 *
 * Kept separate from the homepage location cards because this one reports
 * developments rather than available properties.
 */
export function ProjectLocationCard({
  location,
  projectCount,
  className,
}: ProjectLocationCardProps) {
  const query = serialiseProjectFilters({ ...defaultProjectFilters, location: location.slug })
  const href = `/projects?${query.toString()}`
  const hasProjects = projectCount > 0

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white',
        'shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)]',
        'hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lg',
        'focus-within:-translate-y-1.5 focus-within:shadow-lg',
        className,
      )}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-tint-100">
        <SkeletonImage
          src={location.image.src}
          alt={location.image.alt}
          width={900}
          height={600}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-pill bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur-sm">
          <Icon name="building-2" className="size-3.5 text-accent-600" strokeWidth={2} />
          {hasProjects ? `${projectCount} ${projectCount === 1 ? 'development' : 'developments'}` : 'In pipeline'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <Link to={href} className="after:absolute after:inset-0 after:content-['']">
            {location.name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{location.description}</p>

        <div className="mt-5 flex items-center gap-1.5 border-t border-sand-200 pt-4 text-sm font-semibold text-accent-700">
          <span className="transition-colors duration-200 group-hover:text-accent-600">
            View developments
          </span>
          <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2.2} />
        </div>
      </div>
    </article>
  )
}