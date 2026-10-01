import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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
import type {
  ActiveFilter,
  ListingStatusFilter,
  PropertyFilters,
  PropertyPurpose,
  PropertySort,
  PropertyTag,
  PropertyType,
} from '@/types'
import { replaceSearchParams, useRouter } from '@/shared/hooks/useRouter'

const locationLabels = new Map<string, string>(Object.values(locations).map((l) => [l.slug, l.label]))

function resolveLocationLabel(slug: string): string {
  return locationLabels.get(slug) ?? slug
}

export interface PropertyFiltersController {
  filters: PropertyFilters
  sort: PropertySort
  page: number
  /** Number of individual filters applied — drives the "Filters (n)" badge. */
  activeCount: number
  /** Removable summary of every applied filter. */
  activeFilters: ActiveFilter[]
  /** Price band options for the current purpose, including any ad-hoc range. */
  priceBands: PriceBand[]
  /** Value of the price select for the current range. */
  priceBandValue: string
  isFiltered: boolean
  setPurpose: (purpose: PropertyPurpose | 'any') => void
  setQuery: (query: string) => void
  setLocation: (slug: string) => void
  toggleLocation: (slug: string) => void
  /** Replaces the whole multi-select — used by the single-value search bar select. */
  setPropertyType: (type: PropertyType | null) => void
  togglePropertyType: (type: PropertyType) => void
  toggleStatus: (status: ListingStatusFilter) => void
  toggleTag: (tag: PropertyTag) => void
  setMinBedrooms: (bedrooms: number | null) => void
  setMinBathrooms: (bathrooms: number | null) => void
  /** Applies a preset band, or explicit bounds when `band` is null. */
  setPriceBand: (band: PriceBand | null) => void
  removeFilter: (chip: ActiveFilter) => void
  setSort: (sort: PropertySort) => void
  setPage: (page: number) => void
  reset: () => void
}

/**
 * Owns every piece of listing state — filters, sort and page — and keeps the
 * URL in sync.
 *
 * The URL is the single source of truth: it seeds the initial state, receives
 * every subsequent change via `replaceState` (so filters are shareable without
 * flooding the back button), and re-seeds the state when a navigation link such
 * as `/properties?purpose=rent` is followed while already on this page.
 */
export function usePropertyFilters(): PropertyFiltersController {
  const { query } = useRouter()

  const [filters, setFilters] = useState<PropertyFilters>(() => parseFilters(query))
  const [sort, setSortState] = useState<PropertySort>(() => parseSort(query))
  const [page, setPage] = useState<number>(() => parsePage(query))

  /** The query string we last wrote ourselves, used to ignore our own echo. */
  const ownQueryKey = useRef(query.toString())

  // Adopt filter state pushed into the URL by navigation (nav links, deep links).
  const incomingQueryKey = query.toString()
  useEffect(() => {
    if (incomingQueryKey === ownQueryKey.current) return

    ownQueryKey.current = incomingQueryKey
    setFilters(parseFilters(query))
    setSortState(parseSort(query))
    setPage(parsePage(query))
    // `query` is derived from `incomingQueryKey`, which is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingQueryKey])

  // Publish state changes to the address bar.
  useEffect(() => {
    const nextQuery = serialiseQuery(filters, sort, page)
    ownQueryKey.current = nextQuery.toString()
    replaceSearchParams(nextQuery)
  }, [filters, sort, page])

  /** Any change resets to the first page — page 4 of the old result set makes no sense. */
  const applyFilters = useCallback((updater: (current: PropertyFilters) => PropertyFilters) => {
    setFilters(updater)
    setPage(1)
  }, [])

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

  const setSort = useCallback((nextSort: PropertySort) => {
    setSortState(nextSort)
    setPage(1)
  }, [])

  const reset = useCallback(() => {
    setFilters(defaultFilters)
    setSortState(defaultSort)
    setPage(1)
  }, [])

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
