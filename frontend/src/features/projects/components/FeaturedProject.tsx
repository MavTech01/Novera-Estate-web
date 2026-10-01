import { ButtonLink } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@/shared/components/ui/Link'
import { Reveal } from '@/shared/components/ui/Reveal'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { formatCurrency } from '@/shared/lib/format'
import { projectPath } from '@/shared/lib/routes'
import { projectTypeLabels } from '@/features/projects/data/projectOptions'
import type { Project } from '@/features/projects/types/projectTypes'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface FeaturedProjectProps {
  project: Project
  className?: string
}

/**
 * The promoted development.
 *
 * A reusable feature component: it takes a project rather than reaching for
 * "the featured one" itself, so the same panel can spotlight whichever
 * development the service marks as featured at any time.
 */
export function FeaturedProject({ project, className }: FeaturedProjectProps) {
  const href = projectPath(project.slug)
  const cover = project.images[0]

  const facts = [
    { id: 'price', label: 'Starting from', value: `From ${formatCurrency(project.startingPrice)}` },
    { id: 'units', label: 'Total units', value: project.totalUnits.toLocaleString('en-NG') },
    { id: 'available', label: 'Available now', value: project.availableUnits.toLocaleString('en-NG') },
    { id: 'type', label: 'Project type', value: projectTypeLabels[project.projectType] },
  ]

  return (
    <article
      className={`grid grid-cols-1 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm lg:grid-cols-2 ${className ?? ''}`}
    >
      <Reveal className="relative min-h-[18rem] overflow-hidden bg-tint-100 lg:min-h-[32rem]">
        <SkeletonImage
          src={cover?.src ?? ''}
          alt={cover?.alt ?? `${project.name} in ${project.location}`}
          width={1400}
          height={1050}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2.5 p-5 sm:p-6">
          <ProjectStatusBadge status={project.status} variant="overlay" />
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/90 px-3 py-1 text-xs font-semibold text-ink-700 shadow-sm">
            <Icon name="map-pin" className="size-3.5 text-accent-600" strokeWidth={2} />
            {project.location}
          </span>
        </div>
      </Reveal>

      <Reveal delay={120} className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">
          <Icon name="sparkles" className="size-3.5" strokeWidth={2.2} />
          Featured development
        </p>

        <h3 className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
          <Link href={href} className="transition-colors duration-200 hover:text-accent-700">
            {project.name}
          </Link>
        </h3>

        <p className="mt-4 text-base leading-relaxed text-ink-500">{project.summary}</p>

        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-sand-200 pt-6">
          {facts.map((fact) => (
            <div key={fact.id}>
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                {fact.label}
              </dt>
              <dd className="mt-1.5 font-display text-base font-bold leading-snug text-ink-900">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={href} size="lg" withArrow>
            View Project
          </ButtonLink>
          <ButtonLink href="/contact?type=inspection" variant="outline" size="lg">
            Book an Inspection
          </ButtonLink>
        </div>
      </Reveal>
    </article>
  )
}
