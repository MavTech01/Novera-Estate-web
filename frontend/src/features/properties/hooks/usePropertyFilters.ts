import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { locations } from '@/data/locations'
import { findPriceBandByBounds, getPriceBands, type PriceBand } from '@/data/searchOptions'
import {
  defaultFilters,
  defaultSort,
  describeActiveFilters,
  parseFilters,
  parsePage,
  parseSort,
  serialiseQuery,
  toggleListValue,
} from '@/shared/lib/propertyQuery'
import type { PropertyFiltersController } from '@/shared/types/propertyFiltersController'
import type {
  ActiveFilter,
  ListingStatusFilter,
  PropertyFilters,
  PropertyPurpose,
  PropertySort,
  PropertyTag,
  PropertyType,
} from '@/types'

const locationLabels = new Map<string, string>(Object.values(locations).map((l) => [l.slug, l.label]))

function resolveLocationLabel(slug: string): string {
  return locationLabels.get(slug) ?? slug
}

export type { PropertyFiltersController }

/**
 * The three pieces of listing state the URL carries together.
 *
 * They are always serialised as one unit because they are not independent: a
 * filter change invalidates the page, and a sort change does too. Keeping them
 * in a single value makes that coupling impossible to get wrong at the point
 * where the URL is written.
 */
interface ListingState {
  filters: PropertyFilters
  sort: PropertySort
  page: number
}

/**
 * Owns every piece of listing state — filters, sort and page — and keeps the
 * URL in sync.
 *
 * The URL is the source of truth: `useSearchParams` is reactive, so a nav link
 * such as `/properties?purpose=rent`, a shared deep link and the browser back
 * button are all the same event as a filter click here. Nothing mirrors the
 * listing state into component state, so the filter panels, the result count and
 * the pagination control cannot disagree.
 *
 * Changes are written with `replace`, so filters are shareable without flooding
 * the back button.
 */
export function usePropertyFilters(): PropertyFiltersController {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derived, never mirrored: a new search string is a new listing state.
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const sort = useMemo(() => parseSort(searchParams), [searchParams])
  const page = useMemo(() => parsePage(searchParams), [searchParams])

  /** Writes a change back to the URL, seeing the listing state as it is now. */
  const commit = useCallback(
    (recipe: (current: ListingState) => ListingState) => {
      setSearchParams((current) => {
        const next = recipe({
          filters: parseFilters(current),
          sort: parseSort(current),
          page: parsePage(current),
        })

        return serialiseQuery(next.filters, next.sort, next.page)
      }, { replace: true, preventScrollReset: true })
    },
    [setSearchParams],
  )

  // Tidies a hand-typed or legacy link once on arrival. Guarded by an inequality
  // so it stops once the URL is canonical, which is also what keeps it from
  // fighting back or forward — those never need rewriting.
  useEffect(() => {
    const canonical = serialiseQuery(filters, sort, page)
    if (canonical.toString() !== searchParams.toString()) setSearchParams(canonical, { replace: true, preventScrollReset: true })
  }, [filters, sort, page, searchParams, setSearchParams])

  /** Any change resets to the first page — page 4 of the old result set makes no sense. */
  const applyFilters = useCallback(
    (updater: (current: PropertyFilters) => PropertyFilters) =>
      commit((current) => ({ ...current, filters: updater(current.filters), page: 1 })),
    [commit],
  )

  const setPurpose = useCallback(
    (purpose: PropertyPurpose | 'any') => {
      applyFilters((current) => {
        // Switching between buy and rent invalidates the selected budget band.
        if (current.purpose === purpose) return current

        const nextPurpose = purpose === 'any' ? 'buy' : purpose
        const band = findPriceBandByBounds(nextPurpose, current.minPrice, current.maxPrice)
        const isKnownBand = band !== undefined && getPriceBands(nextPurpose).includes(band)

        return {
          ...current,
          purpose,
          minPrice: isKnownBand ? band.min ?? null : null,
          maxPrice: isKnownBand ? band.max ?? null : null,
        }
      })
    },
    [applyFilters],
  )

  const setQuery = useCallback((query: string) => applyFilters((current) => ({ ...current, query })), [applyFilters])

  const setLocation = useCallback(
    (slug: string) => applyFilters((current) => ({ ...current, location: [slug] })),
    [applyFilters],
  )

  const toggleLocation = useCallback(
    (slug: string) => applyFilters((current) => ({ ...current, location: toggleListValue(current.location, slug) })),
    [applyFilters],
  )

  const setPropertyType = useCallback(
    (type: PropertyType | null) => applyFilters((current) => ({ ...current, propertyType: type ? [type] : [] })),
    [applyFilters],
  )

  const togglePropertyType = useCallback(
    (type: PropertyType) => applyFilters((current) => ({ ...current, propertyType: toggleListValue(current.propertyType, type) })),
    [applyFilters],
  )

  const toggleStatus = useCallback(
    (status: ListingStatusFilter) =>
      applyFilters((current) => ({ ...current, statuses: toggleListValue(current.statuses, status) })),
    [applyFilters],
  )

  const toggleTag = useCallback(
    (tag: PropertyTag) => applyFilters((current) => ({ ...current, tags: toggleListValue(current.tags, tag) })),
    [applyFilters],
  )

  const setMinBedrooms = useCallback(
    (bedrooms: number | null) => applyFilters((current) => ({ ...current, bedrooms })),
    [applyFilters],
  )

  const setMinBathrooms = useCallback(
    (bathrooms: number | null) => applyFilters((current) => ({ ...current, bathrooms })),
    [applyFilters],
  )

  const setPriceBand = useCallback(
    (band: PriceBand | null) =>
      applyFilters((current) => ({
        ...current,
        minPrice: band?.min ?? null,
        maxPrice: band?.max ?? null,
      })),
    [applyFilters],
  )

  const removeFilter = useCallback(
    (chip: ActiveFilter) => {
      if (chip.field === 'purpose') {
        applyFilters((current) => ({ ...current, purpose: defaultFilters.purpose }))
        return
      }

      if (chip.field === 'query') {
        applyFilters((current) => ({ ...current, query: '' }))
        return
      }

      if (chip.field === 'minPrice') {
        applyFilters((current) => ({ ...current, minPrice: null, maxPrice: null }))
        return
      }

      if (chip.field === 'bedrooms') {
        applyFilters((current) => ({ ...current, bedrooms: null }))
        return
      }

      if (chip.field === 'bathrooms') {
        applyFilters((current) => ({ ...current, bathrooms: null }))
        return
      }

      const field = chip.field
      const value = chip.value

      applyFilters((current) => {
        switch (field) {
          case 'location':
            return { ...current, location: current.location.filter((item) => item !== value) }
          case 'propertyType':
            return { ...current, propertyType: current.propertyType.filter((item) => item !== value) }
          case 'statuses':
            return { ...current, statuses: current.statuses.filter((item) => item !== value) }
          case 'tags':
            return { ...current, tags: current.tags.filter((item) => item !== value) }
          default:
            return current
        }
      })
    },
    [applyFilters],
  )

  // Sorting reorders the results, so the current page number stops meaning
  // anything and the first page becomes current again.
  const setSort = useCallback(
    (nextSort: PropertySort) => commit((current) => ({ ...current, sort: nextSort, page: 1 })),
    [commit],
  )

  const setPage = useCallback(
    (nextPage: number) => commit((current) => ({ ...current, page: nextPage })),
    [commit],
  )

  const reset = useCallback(
    () => commit(() => ({ filters: defaultFilters, sort: defaultSort, page: 1 })),
    [commit],
  )

  const purpose: PropertyPurpose = filters.purpose === 'any' ? 'buy' : filters.purpose

  const { priceBands, priceBandValue } = useMemo(() => {
    const bands = getPriceBands(purpose)
    const match =
      findPriceBandByBounds(purpose, filters.minPrice, filters.maxPrice) ??
      bands.find((band) => band.min === filters.minPrice && band.max === filters.maxPrice)

    return { priceBands: bands, priceBandValue: match?.value ?? 'custom' }
  }, [purpose, filters.minPrice, filters.maxPrice])

  const activeFilters = useMemo(() => describeActiveFilters(filters, resolveLocationLabel), [filters])

  return {
    filters,
    sort,
    page,
    activeCount: activeFilters.length,
    activeFilters,
    priceBands,
    priceBandValue,
    isFiltered: activeFilters.length > 0,
    setPurpose,
    setQuery,
    setLocation,
    toggleLocation,
    setPropertyType,
    togglePropertyType,
    toggleStatus,
    toggleTag,
    setMinBedrooms,
    setMinBathrooms,
    setPriceBand,
    removeFilter,
    setSort,
    setPage,
    reset,
  }
}
