import { images } from '@/assets/images'
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
          src: images.categories.developments,
          alt: 'Contemporary residential development with landscaped grounds and apartment blocks, photographed for Novera Estates',
        }}
        breadcrumbs={pageCrumbs({ label: 'Projects' })}
        trust={projectTrust}
      />

      {/*
        Sits over the banner's wave, but only just. The site convention elsewhere
        pulls these search panels up by 48px, which is too far for a panel this
        deep — its top edge sat level with the wave crest and the two white
        shapes merged into one. A smaller overlap keeps the "part of the banner"
        reading while leaving a clear band of white between the curve and the card.
      */}
      <div className="relative z-20 -mt-4 sm:-mt-5 lg:-mt-6">
        <Container>
          <ProjectSearchForm controller={controller} onSearch={onSearch} />
        </Container>
      </div>
    </>
  )
}
