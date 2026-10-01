import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { replaceSearchParams, useRouter } from '@/shared/hooks/useRouter'
import type {
  ActiveLocationFilter,
  LocationCategoryValue,
  LocationFilters,
} from '@/features/locations/types/locationTypes'
import {
  defaultLocationFilters,
  describeActiveLocationFilters,
  hasActiveLocationFilters,
  parseLocationFilters,
  serialiseLocationFilters,
} from '@/features/locations/utils/locationUtils'

/**
 * Owns the Locations page's search and category state, and keeps the URL in
 * sync.
 *
 * The URL is the single source of truth: it seeds the initial state, receives
 * every subsequent change via `replaceState` (so a search is shareable without
 * flooding the back button), and re-seeds the state when a deep link such as
 * `/locations?q=lekki` is followed while this page is already mounted.
 *
 * That is what makes the hero search box, the category strip and the grid three
 * presentations of one value — there is no second copy of the filters to keep in
 * step, so they cannot disagree.
 *
 * The free-text matching itself lives in `../utils/locationUtils`; this hook
 * only manages state and serialisation.
 */
export interface LocationSearchController {
  filters: LocationFilters
  /** Removable summary of everything currently applied. */
  activeFilters: ActiveLocationFilter[]
  /** Number of individual filters applied. */
  activeCount: number
  isFiltered: boolean
  /** True while the text box holds something, for the clear button. */
  hasQuery: boolean
  setQuery: (query: string) => void
  setCategory: (category: LocationCategoryValue) => void
  /** Clears one facet, or everything when no field is passed. */
  removeFilter: (field?: keyof LocationFilters) => void
  reset: () => void
}

export function useLocationSearch(): LocationSearchController {
  const { query } = useRouter()

  const [filters, setFilters] = useState<LocationFilters>(() => parseLocationFilters(query))

  /** The query string we last wrote ourselves, used to ignore our own echo. */
  const ownQueryKey = useRef(query.toString())

  // Adopt filter state pushed into the URL by navigation (deep links) while this
  // page is already mounted.
  const incomingQueryKey = query.toString()
  useEffect(() => {
    if (incomingQueryKey === ownQueryKey.current) return

    ownQueryKey.current = incomingQueryKey
    setFilters(parseLocationFilters(query))
    // `query` is derived from `incomingQueryKey`, which is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingQueryKey])

  // Publish state changes to the address bar.
  useEffect(() => {
    const nextQuery = serialiseLocationFilters(filters)
    ownQueryKey.current = nextQuery.toString()
    replaceSearchParams(nextQuery)
  }, [filters])

  const setQuery = useCallback((value: string) => {
    setFilters((current) => ({ ...current, query: value }))
  }, [])

  const setCategory = useCallback((value: LocationCategoryValue) => {
    setFilters((current) => ({ ...current, category: value }))
  }, [])

  const removeFilter = useCallback((field?: keyof LocationFilters) => {
    setFilters((current) =>
      field ? { ...current, [field]: defaultLocationFilters[field] } : defaultLocationFilters,
    )
  }, [])

  const reset = useCallback(() => setFilters(defaultLocationFilters), [])

  const activeFilters = useMemo(() => describeActiveLocationFilters(filters), [filters])

  return {
    filters,
    activeFilters,
    activeCount: activeFilters.length,
    isFiltered: hasActiveLocationFilters(filters),
    hasQuery: filters.query.length > 0,
    setQuery,
    setCategory,
    removeFilter,
    reset,
  }
}
