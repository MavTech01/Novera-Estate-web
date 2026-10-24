import { useCallback, useRef, useState } from 'react'

import { useAllProjects } from '@/features/projects'
import {
  DevelopmentsByLocation,
  FeaturedLocation,
  FeaturedLocationSkeleton,
  LocationActiveFilters,
  LocationEmptyState,
  LocationErrorState,
  LocationFilterSheet,
  LocationGrid,
  LocationGridSkeleton,
  LocationHero,
  LocationMap,
  LocationsClosingCta,
  PropertiesByLocation,
  WhyLocationMatters,
  useAllLocations,
  useFeaturedLocation,
  useLocationSearch,
  useLocations,
} from '@/features/locations'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { routes } from '@/shared/lib/routes'

/**
 * Locations page — discover an area, then act on it.
 *
 * Kept deliberately thin, mirroring `ProjectsPage`: `useLocationSearch` owns the
 * URL-backed search and category state, `useLocations` owns the request, and
 * this file only decides which section renders for which state. The catalogue
 * layout can change without touching the data layer.
 *
 * The page answers two different questions in two different halves. The top —
 * hero, filters, grid — is "does Novera have anywhere in this area?", answered
 * against a small, fast, searchable set of six. The bottom — developments, map,
 * comparison — is "what is this place actually like?", and describes areas
 * rather than inventory. Mixing them would put a marketing comparison table next
 * to a result count that it has no bearing on.
 *
 * Two rules govern what appears when:
 *
 *  - The **featured area** is a promotion, not a result, so it hides as soon as
 *    a search or category is applied. A highlighted area beside filtered results
 *    would contradict what the visitor just asked for.
 *  - The **catalogue sections** below describe the areas themselves, so they
 *    stay put and simply dim while a search is in flight, rather than vanishing
 *    and returning as the visitor types.
 */
export function LocationsPage() {
  const controller = useLocationSearch()
  const { filters, isFiltered } = controller

  const {
    value: locations,
    status,
    error,
    isLoading,
    isStale,
    retry,
  } = useLocations(filters)

  const { value: allLocations } = useAllLocations()
  const { value: featuredLocation } = useFeaturedLocation()
  const { value: projects } = useAllProjects()

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  /**
   * Submitting the hero form brings the grid into view.
   *
   * Filtering is live, so this is the only thing pressing Enter can usefully do —
   * and on mobile the search field sits well above the results.
   */
  const scrollToResults = useCallback(() => {
    setIsFilterSheetOpen(false)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const isInitialLoad = isStale === false && status === 'loading' && locations.length === 0
  const isRefreshing = isLoading && locations.length > 0

  return (
    <>
      <main id="main-content">
        <LocationHero
          controller={controller}
          suggestions={allLocations.map((location) => ({ slug: location.slug, name: location.name }))}
          onSearch={scrollToResults}
          onOpenFilters={() => setIsFilterSheetOpen(true)}
          wave={isFiltered ? 'cream' : 'white'}
        />

        {/* Featured area: a promotion, not a result, so it hides as soon as a
            search or category is applied. */}
        {!isFiltered && (
          <section className="bg-white pt-12 sm:pt-16 lg:pt-20 xl:pt-24 pb-20 sm:pb-24 lg:pb-28" aria-label="Featured location">
            <Container>
              {!featuredLocation ? (
                <FeaturedLocationSkeleton />
              ) : (
                <FeaturedLocation location={featuredLocation} />
              )}
            </Container>
          </section>
        )}

        {/* The searchable catalogue. */}
        <Section tone="tint" className="scroll-mt-24">
          <Container>
            <SectionHeading
              eyebrow="Our areas"
              title="Explore Our Locations"
              description="Find the right area for your lifestyle, property goals, and everyday needs."
            />

            <div ref={gridRef} className="mt-8 scroll-mt-24 lg:mt-10">
              <LocationActiveFilters
                filters={controller.activeFilters}
                onRemove={(field) => controller.removeFilter(field)}
                onClearAll={controller.reset}
                className="mb-6"
              />

              {isInitialLoad ? (
                <LocationGridSkeleton count={6} />
              ) : status === 'error' ? (
                <LocationErrorState message={error ?? undefined} onRetry={retry} />
              ) : locations.length === 0 ? (
                <LocationEmptyState
                  onReset={controller.reset}
                  action={{ label: 'Browse all properties', href: routes.properties }}
                />
              ) : (
                <LocationGrid
                  locations={locations}
                  label={`Showing ${locations.length} ${locations.length === 1 ? 'location' : 'locations'}`}
                  className={isRefreshing ? 'opacity-60 transition-opacity duration-200' : undefined}
                />
              )}
            </div>
          </Container>
        </Section>

        {/* Below here the page describes areas rather than results, so these
            sections always take the unfiltered catalogue. */}
        <DevelopmentsByLocation locations={allLocations} projects={projects} />

        <WhyLocationMatters />

        <LocationMap locations={allLocations} />

        <PropertiesByLocation locations={allLocations} />
      </main>

      <LocationFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        controller={controller}
        onApply={scrollToResults}
        resultCount={locations.length}
      />

      <LocationsClosingCta />
    </>
  )
}
