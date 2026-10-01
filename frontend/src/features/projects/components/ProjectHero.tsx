import { company } from '@/data/company'
import { PageHero, type PageHeroTrustItem } from '@/shared/components/layout/PageHero'
import { Container } from '@/shared/components/ui/Container'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import { ProjectSearchForm } from './ProjectSearchForm'

interface ProjectHeroProps {
  controller: ProjectFiltersController
  onSearch: () => void
}

const projectTrust: readonly PageHeroTrustItem[] = [
  { id: 'gated', icon: 'shield-check', label: 'Gated, serviced developments' },
  { id: 'inspections', icon: 'calendar-search', label: 'Site inspections available' },
  { id: 'corridors', icon: 'map-pin', label: 'Across Lagos’ growth corridors' },
]

/**
 * Projects page hero: the promise over architectural photography, with the
 * search tool pulled up beneath so it reads as part of the banner rather than
 * as a separate widget.
 *
 * The banner itself is the shared `PageHero`; this component supplies the
 * projects copy and keeps the search form wired to the filter controller. The
 * form is a sibling rather than a child so it can overlap the banner's wave
 * without the wave's white fill being cut off by it.
 */
export function ProjectHero({ controller, onSearch }: ProjectHeroProps) {
  return (
    <>
      <PageHero
        headingId="projects-hero-heading"
        eyebrow={company.descriptor}
        title="Discover Our Developments"
        description="Explore carefully planned residential developments designed for comfortable living, strong communities, and long-term value."
        image={{
          src: '/images/categories/developments.webp',
          alt: 'Contemporary residential development with landscaped grounds and apartment blocks, photographed for Novera Estates',
        }}
        breadcrumbs={pageCrumbs({ label: 'Projects' })}
        trust={projectTrust}
      />

      {/* Pulled up 48px on desktop, over the banner's wave. */}
      <div className="relative z-20 -mt-8 sm:-mt-10 lg:-mt-12">
        <Container>
          <ProjectSearchForm controller={controller} onSearch={onSearch} />
        </Container>
      </div>
    </>
  )
}
