import { company } from '@/data/company'
import { Icon } from '@/shared/components/ui/Icon'
import { PageHero } from '@/shared/components/layout/PageHero'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import { ProjectSearchForm } from './ProjectSearchForm'

interface ProjectHeroProps {
  controller: ProjectFiltersController
  onSearch: () => void
}

/**
 * Projects page hero: the promise over architectural photography, with the
 * search tool pulled up beneath so it reads as part of the banner rather than
 * as a separate widget.
 *
 * The banner itself is the shared `PageHero`; this component exists to supply
 * the projects copy and to keep the search form wired to the filter controller.
 */
export function ProjectHero({ controller, onSearch }: ProjectHeroProps) {
  return (
    <PageHero
      headingId="projects-hero-heading"
      size="compact"
      eyebrow={company.descriptor}
      title="Discover Our Developments"
      description="Explore carefully planned residential developments designed for comfortable living, strong communities, and long-term value."
      image={{
        src: '/images/categories/developments.webp',
        alt: 'Contemporary residential development with landscaped grounds and apartment blocks, photographed for Novera Estates',
      }}
      breadcrumbs={pageCrumbs({ label: 'Projects' })}
      meta={
        <>
          <span className="flex items-center gap-2">
            <Icon name="shield-check" className="size-4 text-accent-300" strokeWidth={2} />
            Gated, serviced developments
          </span>
          <span className="flex items-center gap-2">
            <Icon name="calendar-search" className="size-4 text-accent-300" strokeWidth={2} />
            Site inspections available
          </span>
        </>
      }
    >
      <ProjectSearchForm controller={controller} onSearch={onSearch} />
    </PageHero>
  )
}
