import { useCallback, useEffect, useRef, useState } from 'react'

import { MobileFilterDrawer } from '../../components/properties/MobileFilterDrawer'
import { PropertiesPageHeader } from '../../components/properties/PropertiesPageHeader'
import { PropertyActiveFilters } from '../../components/properties/PropertyActiveFilters'
import { PropertyEmptyState } from '../../components/properties/PropertyEmptyState'
import { PropertyErrorState } from '../../components/properties/PropertyErrorState'
import { PropertyFiltersSidebar } from '../../components/properties/PropertyFiltersSidebar'
import { PropertyGrid } from '../../components/properties/PropertyGrid'
import { PropertyListingCTA } from '../../components/properties/PropertyListingCTA'
import { PropertyPagination } from '../../components/properties/PropertyPagination'
import { PropertyResultsHeader } from '../../components/properties/PropertyResultsHeader'
import { PropertySearchBar } from '../../components/properties/PropertySearchBar'
import { PropertyGridSkeleton } from '../../components/properties/PropertySkeleton'
import { Container } from '../../components/ui/Container'
import { useFavourites } from '../../hooks/useFavourites'
import { usePropertyFilters } from '../../hooks/usePropertyFilters'
import { usePropertyListing } from '../../hooks/usePropertyListing'

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

  return (
    <>
      <main id="main-content">
        {/* Page header */}
        <section className="bg-white pb-8 pt-28 sm:pt-32 lg:pb-10 lg:pt-36">
          <Container>
            <PropertiesPageHeader
              title="Find Your Next Property"
              description="Explore homes, apartments, land and investment opportunities from Novera Estates."
            />
          </Container>
        </section>

        {/* Search tool */}
        <Container>
          <PropertySearchBar controller={controller} onSearch={handleSearch} className="relative z-10 -mt-2 sm:-mt-6" />
        </Container>

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
