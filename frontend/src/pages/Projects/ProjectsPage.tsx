import { useCallback, useRef } from 'react'

import {
  FeaturedProject,
  PrimeLocations,
  ProjectActiveFilters,
  ProjectCategoryFilter,
  ProjectDemoNotice,
  ProjectEmptyState,
  ProjectErrorState,
  ProjectGrid,
  ProjectGridSkeleton,
  ProjectHero,
  ProjectMobileFilterDrawer,
  ProjectResultsHeader,
  ProjectsClosingCta,
  WhyChooseNovera,
  useFeaturedProject,
  useProjectFilters,
  useProjects,
} from '@/features/projects'
import { Container } from '@/shared/components/ui/Container'

/**
 * Developments page — discover, filter, browse, open.
 *
 * Kept deliberately thin, mirroring `PropertiesPage`: `useProjectFilters` owns
 * the URL-backed filter state and `useProjects` owns the request lifecycle. This
 * file only decides which section renders for which state, so the catalogue
 * layout can change without touching the data layer.
 *
 * The results section is *not* full-bleed — it needs the left padding to line up
 * with the container the hero's search tool sits in.
 */
export function ProjectsPage() {
  const controller = useProjectFilters()
  const { filters, activeCount, activeFilters, reset, removeFilter } = controller

  const { value: projects, status, error, isLoading, isStale, retry } = useProjects(filters)
  const { value: featuredProject } = useFeaturedProject()

  const resultsRef = useRef<HTMLDivElement>(null)

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Submitting the hero form (or confirming the drawer) brings the grid into
  // view — on mobile the form sits well above the results.
  const handleSearch = useCallback(() => {
    scrollToResults()
  }, [scrollToResults])

  const isInitialLoad = isStale === false && status === 'loading' && projects.length === 0
  const isRefreshing = isLoading && projects.length > 0

  return (
    <>
      <main id="main-content">
        <ProjectHero controller={controller} onSearch={handleSearch} />

        <section
          className="bg-white pb-20 pt-14 sm:pb-24 sm:pt-16 lg:pb-28"
          aria-labelledby="projects-catalogue-heading"
        >
          <Container>
            <ProjectDemoNotice className="mb-10" />

            <h2 id="projects-catalogue-heading" className="sr-only">
              Browse developments
            </h2>

            <ProjectCategoryFilter value={filters.projectType} onChange={controller.setProjectType} />

            <div ref={resultsRef} className="mt-10 scroll-mt-24 sm:mt-12">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <ProjectResultsHeader total={projects.length} isLoading={isInitialLoad} />
                <ProjectMobileFilterDrawer controller={controller} onApply={handleSearch} />
              </div>

              <ProjectActiveFilters
                filters={activeFilters}
                onRemove={(filter) => removeFilter(filter.field)}
                onClearAll={reset}
                className="mt-6 border-b border-sand-200 pb-6"
              />

              <div className="mt-8">
                {isInitialLoad ? (
                  <ProjectGridSkeleton count={6} />
                ) : status === 'error' ? (
                  <ProjectErrorState message={error ?? undefined} onRetry={retry} />
                ) : projects.length === 0 ? (
                  <ProjectEmptyState
                    onReset={reset}
                    action={{ label: 'Speak to an Agent', href: '/contact?type=inspection' }}
                  />
                ) : (
                  <ProjectGrid
                    projects={projects}
                    label={`Showing ${projects.length} ${projects.length === 1 ? 'development' : 'developments'}`}
                    className={isRefreshing ? 'opacity-60 transition-opacity duration-200' : undefined}
                  />
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* The promoted development is a discovery aid, not a result — showing it
            while a filter is applied would contradict the result count. */}
        {featuredProject && !activeCount && (
          <section className="bg-white pb-20 sm:pb-24 lg:pb-28" aria-labelledby="projects-featured-heading">
            <Container>
              <h2 id="projects-featured-heading" className="sr-only">
                Featured development
              </h2>
              <FeaturedProject project={featuredProject} />
            </Container>
          </section>
        )}

        <WhyChooseNovera />
        <PrimeLocations />
      </main>

      <ProjectsClosingCta />
    </>
  )
}