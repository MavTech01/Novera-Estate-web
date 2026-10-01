import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { company } from '@/data/company'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import { ProjectSearchForm } from './ProjectSearchForm'

interface ProjectHeroProps {
  controller: ProjectFiltersController
  onSearch: () => void
}

/**
 * Projects page hero: the promise on the left, architectural photography on the
 * right, and the search tool pulled up beneath so it reads as part of the
 * banner rather than as a separate widget.
 */
export function ProjectHero({ controller, onSearch }: ProjectHeroProps) {
  return (
    <>
      <section
        className="relative overflow-hidden bg-white pb-40 pt-28 sm:pb-44 sm:pt-32 lg:pb-48 lg:pt-36"
        aria-labelledby="projects-hero-heading"
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-sand-200" />
        <div
          aria-hidden
          className="blob-orange absolute -right-24 top-24 hidden h-[26rem] w-[26rem] rounded-[3rem] opacity-20 lg:block"
        />

        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-pill bg-tint-50 px-4 py-1.5 text-[length:var(--text-label)] uppercase leading-4 text-accent-700">
                <Icon name="building-2" className="size-3.5" strokeWidth={2.2} />
                {company.descriptor}
              </p>

              <h1 id="projects-hero-heading" className="mt-6 text-ink-900">
                Discover Our Developments
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
                Explore carefully planned residential developments designed for comfortable living, strong
                communities, and long-term value.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
                <span className="flex items-center gap-2">
                  <Icon name="shield-check" className="size-4 text-accent-500" strokeWidth={2} />
                  Gated, serviced developments
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="calendar-search" className="size-4 text-accent-500" strokeWidth={2} />
                  Site inspections available
                </span>
              </div>
            </div>

            <div className="animate-fade-up-slow relative" style={{ animationDelay: '120ms' }}>
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
                <SkeletonImage
                  src="/images/categories/developments.webp"
                  alt="Contemporary residential development with landscaped grounds and apartment blocks, photographed for Novera Estates"
                  width={1400}
                  height={1050}
                  loading="eager"
                  fetchPriority="high"
                  className="aspect-[4/3] w-full"
                />
              </div>

              <div className="absolute -bottom-6 -left-4 z-20 flex items-center gap-3 rounded-xl bg-white p-4 shadow-md sm:-left-8">
                <span className="flex size-11 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                  <Icon name="compass" className="size-5" strokeWidth={2} />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-sm font-bold leading-tight text-ink-900">
                    {company.tagline}
                  </span>
                  <span className="mt-1 text-xs text-ink-500">Lekki · Ajah · Ikoyi · Ikeja · V.I · Yaba</span>
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Search tool lifted into the banner. */}
      <div className="relative z-20 -mt-32 sm:-mt-36 lg:-mt-40">
        <Container>
          <ProjectSearchForm controller={controller} onSearch={onSearch} />
        </Container>
      </div>
    </>
  )
}
