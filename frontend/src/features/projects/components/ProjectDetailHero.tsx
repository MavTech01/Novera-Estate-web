import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { routes } from '@/shared/lib/routes'
import { projectStatusLabels, projectTypeLabels } from '@/features/projects/data/projectOptions'
import { buildProjectGallery } from '@/features/projects/utils/projectGallery'
import type { Project } from '@/features/projects/types/projectTypes'
import { projectInspectionHref, projectWhatsAppHref } from '@/features/projects/utils/projectContact'
import { ProjectStatusBadge } from './ProjectStatusBadge'

/**
 * Project hero — breadcrumb, name, status, the three headline facts and the two
 * primary actions.
 *
 * Kept deliberately short. A long descriptive introduction above the fold pushes
 * the gallery and overview below the viewport on a phone, and the facts are
 * already repeated in the overview grid; the hero's job is to orient and to offer
 * the two actions a visitor most often wants.
 */
export function ProjectDetailHero({ project }: { project: Project }) {
  // The gallery builder is the single source for which images exist, including
  // the neighbourhood fallback, so the hero cannot end up with a broken source
  // that the gallery below it handles correctly.
  const [hero] = buildProjectGallery(project)

  return (
    <section className="relative overflow-hidden bg-ink-800 pt-8 pb-16 text-white sm:pt-10 sm:pb-20">
      {/* Location photography, heavily treated so text stays legible. */}
      <div aria-hidden className="absolute inset-0">
        <SkeletonImage
          src={hero.src}
          alt=""
          width={1600}
          height={900}
          fetchPriority="high"
          className="size-full"
          imgClassName="media"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/85 to-ink-900/60" />
      </div>

      <Container className="relative">
        <Breadcrumbs
          tone="onBrown"
          items={[
            { label: 'Home', href: routes.home },
            { label: 'Projects', href: routes.projects },
            { label: project.name },
          ]}
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="flex flex-wrap items-center gap-3">
                <ProjectStatusBadge status={project.status} variant="overlay" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  {projectTypeLabels[project.projectType]}
                </span>
              </p>

              <h1 className="mt-5 font-display text-3xl leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                {project.name}
              </h1>

              <p className="mt-4 flex items-center gap-2 text-sm text-white/70 sm:text-base">
                <Icon name="map-pin" className="size-4 shrink-0 text-accent-300" strokeWidth={2} />
                {project.location}, {project.locationInfo.address.split(',')[0]}, Lagos
              </p>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  href={projectInspectionHref(project)}
                  variant="accent"
                  size="lg"
                  className="w-full sm:w-auto"
                  withArrow
                >
                  Book an Inspection
                </ButtonLink>

                <ButtonLink
                  href={projectWhatsAppHref(project)}
                  variant="white"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Icon name="message" className="size-4" strokeWidth={2} />
                  Enquire on WhatsApp
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          {/* Headline facts */}
          <Reveal delay={140} className="lg:col-span-4">
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-1">
              <HeroFact
                label="Starting price"
                value={`From ${formatCurrency(project.startingPrice)}`}
                icon="trending-up"
              />
              <HeroFact label="Units available" value={formatAvailable(project)} icon="building-2" />
              <HeroFact
                label={project.status === 'completed' ? 'Completed' : 'Expected completion'}
                value={formatDate(project.completionDate)}
                icon={project.status === 'completed' ? 'check-circle' : 'calendar-check'}
              />
            </dl>

            <p className="mt-3 text-[0.6875rem] leading-relaxed text-white/45">
              Demonstration data for a fictional development. {projectStatusLabels[project.status]}.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

interface HeroFactProps {
  label: string
  value: string
  icon: Parameters<typeof Icon>[0]['name']
}

/** One cell of the hero fact panel. */
function HeroFact({ label, value, icon }: HeroFactProps) {
  return (
    <div className="bg-ink-800/60 p-4 backdrop-blur-sm sm:p-5">
      <dt className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/50">
        <Icon name={icon} className="size-3.5 shrink-0 text-accent-300" strokeWidth={2} />
        {label}
      </dt>
      <dd className="mt-2 font-display text-sm font-bold leading-snug text-white sm:text-base">{value}</dd>
    </div>
  )
}

/** Falls back to a plain statement when nothing is available. */
function formatAvailable(project: Project): string {
  return project.availableUnits > 0
    ? `${project.availableUnits.toLocaleString('en-NG')} of ${project.totalUnits.toLocaleString('en-NG')}`
    : 'Fully allocated'
}
