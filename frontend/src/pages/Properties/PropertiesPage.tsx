import { images } from '@/assets/images'
import { useCallback, useEffect, useRef, useState } from 'react'

import { MobileFilterDrawer } from '@/shared/components/properties/MobileFilterDrawer'
import { PropertyActiveFilters } from '@/shared/components/properties/PropertyActiveFilters'
import { PropertyEmptyState } from '@/shared/components/properties/PropertyEmptyState'
import { PropertyErrorState } from '@/shared/components/properties/PropertyErrorState'
import { PropertyFiltersSidebar } from '@/shared/components/properties/PropertyFiltersSidebar'
import { PropertyGrid } from '@/shared/components/properties/PropertyGrid'
import { PropertyListingCTA } from '@/shared/components/properties/PropertyListingCTA'
import { PropertyPagination } from '@/shared/components/properties/PropertyPagination'
import { PropertyResultsHeader } from '@/shared/components/properties/PropertyResultsHeader'
import { PropertySearchBar } from '@/shared/components/properties/PropertySearchBar'
import { PropertyGridSkeleton } from '@/shared/components/properties/PropertySkeleton'
import { Container } from '@/shared/components/ui/Container'
import { PageHero } from '@/shared/components/layout/PageHero'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import { routes } from '@/shared/lib/routes'
import { useFavourites } from '@/shared/hooks/useFavourites'
import { usePropertyFilters } from '@/features/properties/hooks/usePropertyFilters'
import { usePropertyListing } from '@/features/properties/hooks/usePropertyListing'

/** Banner copy and photograph, which differ for the sale and rent experiences. */
const catalogueHero = {
  buy: {
    eyebrow: 'For sale',
    title: 'Find Your Next Property',
    description: 'Explore homes, apartments, land and investment opportunities from Novera Estates.',
    image: {
      src: images.hero.main,
      alt: 'Aerial view of residential streets and rooftops across a city',
    },
    breadcrumbs: pageCrumbs({ label: 'Properties' }),
  },
  rent: {
    eyebrow: 'To rent',
    title: 'Homes and Apartments to Rent in Lagos',
    description:
      'Verified rentals across the neighbourhoods we know best, each one inspected before it reaches you.',
    image: {
      src: images.categories.apartments,
      alt: 'Modern apartment building with balconies and large windows',
    },
    breadcrumbs: pageCrumbs({ label: 'Properties', href: routes.properties }, { label: 'Rent' }),
  },
} as const

/** The reassurance row shared by both catalogue banners. */
const catalogueTrust = [
  { id: 'verified', icon: 'badge-check', label: 'Verified listings' },
  { id: 'inspected', icon: 'shield-check', label: 'Inspected before listing' },
  { id: 'guided', icon: 'users', label: 'Guided viewings' },
] as const

/**
 * Property discovery page — search, filter, sort, browse, open, enquire.
 *
 * The component is deliberately thin: `usePropertyFilters` owns the URL-backed
 * filter/sort/page state and `usePropertyListing` owns the request lifecycle.
 * Both talk to the property repository, which is the only module that knows the
 * listings currently come from mock data instead of `GET /api/properties`.
 */
export function PropertiesPage() {
  const controller = usePropertyFilters()
  const { filters, sort, page, activeCount, activeFilters, setPage, reset, setSort } = controller

  const { results, error, isLoading, isStale, retry, status } = usePropertyListing({
    filters,
    sort,
    page,
  })

  const { isFavourite, toggleFavourite } = useFavourites()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  // The repository clamps the page to the available range; mirror that back so
  // the URL and the pagination control never point at an empty page.
  useEffect(() => {
    if (!isStale && results && results.page !== page) setPage(results.page)
  }, [results, isStale, page, setPage])

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleSearch = useCallback(() => {
    setIsDrawerOpen(false)
    scrollToResults()
  }, [scrollToResults])

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage)
      scrollToResults()
    },
    [setPage, scrollToResults],
  )

  // Skeletons only on the very first load; later refreshes dim the existing grid.
  const isInitialLoad = results === null
  const isRefreshing = isLoading && results !== null
  const total = results?.total ?? 0
  const items = results?.items ?? []

  const isRenting = filters.purpose === 'rent'
  const hero = isRenting ? catalogueHero.rent : catalogueHero.buy

  return (
    <>
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <PageHero {...hero} trust={catalogueTrust} />

        {/*
          The search panel overlaps the base of the banner and its wave — but only
          slightly, for the same reason as the Projects and Locations panels: a
          48px pull-up put its top edge level with the wave crest, and two white
          shapes at that height read as one.
        */}
        <div className="relative z-20 -mt-4 sm:-mt-5 lg:-mt-6">
          <Container>
            <PropertySearchBar controller={controller} onSearch={handleSearch} />
          </Container>
        </div>

        {/* Results */}
        <section className="pb-20 pt-12 sm:pt-14" aria-labelledby="property-results-heading">
          <Container>
            <h2 id="property-results-heading" className="sr-only">
              Property search results
            </h2>

            <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[18.5rem_minmax(0,1fr)] xl:gap-10">
              <PropertyFiltersSidebar controller={controller} />

              <div ref={resultsRef} className="scroll-mt-24 min-w-0">
                <PropertyResultsHeader
                  total={total}
                  sort={sort}
                  onSortChange={setSort}
                  onOpenFilters={() => setIsDrawerOpen(true)}
                  activeCount={activeCount}
                  isLoading={isRefreshing}
                />

                <PropertyActiveFilters
                  filters={activeFilters}
                  onRemove={controller.removeFilter}
                  onClearAll={reset}
                  className="mt-6 border-b border-sand-200 pb-6"
                />

                <div className="mt-8">
                  {isInitialLoad ? (
                    <PropertyGridSkeleton />
                  ) : status === 'error' ? (
                    <PropertyErrorState message={error ?? undefined} onRetry={retry} />
                  ) : total === 0 ? (
                    <PropertyEmptyState
                      onReset={reset}
                      action={{ label: 'Browse All Properties', href: '/properties' }}
                    />
                  ) : (
                    <>
                      <PropertyGrid
                        properties={items}
                        isFavourite={isFavourite}
                        onToggleFavourite={toggleFavourite}
                        label={`Showing ${results?.from ?? 0} to ${results?.to ?? 0} of ${total} properties`}
                        className={
                          isRefreshing
                            ? 'grid grid-cols-1 gap-6 opacity-60 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7'
                            : undefined
                        }
                      />

                      {results && (
                        <PropertyPagination
                          className="mt-12 border-t border-sand-200 pt-10"
                          page={results.page}
                          pageCount={results.pageCount}
                          total={results.total}
                          onChange={handlePageChange}
                          label={`Showing ${results.from}–${results.to} of ${results.total} properties`}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <MobileFilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        controller={controller}
        resultCount={total}
      />

      <PropertyListingCTA />
    </>
  )
}
