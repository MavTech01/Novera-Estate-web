import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { cn } from '@/shared/lib/cn'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { routes } from '@/shared/lib/routes'
import { projectTypeLabels } from '@/features/projects/data/projectOptions'
import { buildProjectGallery } from '@/features/projects/utils/projectGallery'
import type { Project } from '@/features/projects/types/projectTypes'
import { projectInspectionHref, projectWhatsAppHref } from '@/features/projects/utils/projectContact'
import { ProjectStatusBadge } from './ProjectStatusBadge'

/**
 * Project hero — breadcrumb, name, status, headline facts and the two actions a
 * visitor most often wants.
 *
 * The photography is a *background*, so the overlay is a left-to-right wash
 * rather than the previous bottom-up one: the title is set flush left, so it
 * needs the left of the frame darkened, and a vertical gradient leaves the upper
 * left — where the heading sits — the brightest part of the image. On a dark
 * photograph that is the difference between readable and not.
 *
 * Top padding clears the fixed navbar. The navbar is 72px on phones and 80px from
 * `lg` up (`Navbar.tsx`), so the hero adds its own rhythm on top of that rather
 * than tucking its breadcrumb underneath.
 *
 * The facts panel is a frosted card in the right column rather than a row beneath
 * the text, which is what left it looking detached before.
 */
export function ProjectDetailHero({ project }: { project: Project }) {
  // The gallery builder is the single source for which images exist, including
  // the neighbourhood fallback, so the hero cannot end up with a broken source
  // that the gallery below it handles correctly.
  const [hero] = buildProjectGallery(project)

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-ink-800 text-white',
        // Navbar height (72/80px) + section rhythm, as one value so the
        // breadcrumb can never start underneath the fixed header.
        'pt-[7.5rem] pb-14 sm:pb-16 lg:pt-[8.5rem] lg:pb-20',
      )}
    >
      {/* Location photography, treated so the heading is legible on any frame. */}
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
        {/* Horizontal wash for the left-aligned text, plus an overall darkening. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/80 to-ink-900/45" />
        <div className="absolute inset-0 bg-ink-900/35" />
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

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="flex flex-wrap items-center gap-3">
                <ProjectStatusBadge status={project.status} variant="overlay" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  {projectTypeLabels[project.projectType]}
                </span>
              </p>

              {/*
                Fluid rather than a step per breakpoint: the viewport range the
                hero actually spans is wide, and discrete jumps read as a mistake
                at 1024 and 1440 alike.
              */}
              <h1 className="mt-5 font-display text-[clamp(2.125rem,5.2vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-white">
                {project.name}
              </h1>

              <p className="mt-4 flex items-center gap-2 text-sm text-white/80 sm:text-base">
                <Icon name="map-pin" className="size-4 shrink-0 text-accent-300" strokeWidth={2} />
                {project.location}
              </p>

              <p className="mt-5 max-w-[35rem] text-sm leading-relaxed text-white/80 sm:text-base">
                {project.summary}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
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

          {/* Headline facts, frosted so the photograph shows through faintly. */}
          <Reveal delay={140} className="lg:col-span-5">
            <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg backdrop-blur-md sm:grid-cols-3 lg:grid-cols-1">
              <HeroFact
                label="Starting Price"
                value={`From ${formatCurrency(project.startingPrice)}`}
                icon="trending-up"
              />
              <HeroFact label="Units Available" value={formatAvailable(project)} icon="building-2" />
              <HeroFact
                label={project.status === 'completed' ? 'Completed' : 'Expected Completion'}
                value={formatDate(project.completionDate)}
                icon={project.status === 'completed' ? 'check-circle' : 'calendar-check'}
              />
            </dl>
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
    <div className="bg-ink-800/45 p-5 backdrop-blur-md sm:p-6">
      <dt className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/60">
        <Icon name={icon} className="size-3.5 shrink-0 text-accent-300" strokeWidth={2} />
        {label}
      </dt>
      <dd className="mt-2 font-display text-base font-bold leading-snug text-white">{value}</dd>
    </div>
  )
}

/** Falls back to a plain statement when nothing is available. */
function formatAvailable(project: Project): string {
  return project.availableUnits > 0
    ? `${project.availableUnits.toLocaleString('en-NG')} of ${project.totalUnits.toLocaleString('en-NG')}`
    : 'Fully allocated'
}
