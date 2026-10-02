import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

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
 * The URL is the source of truth: `useSearchParams` is reactive, so a deep link
 * such as `/locations?q=lekki` and a browser back button are the same event as a
 * filter click here — they all change the search string and this hook reads it
 * back. Nothing mirrors the filters into component state, so the hero search box,
 * the category strip and the grid cannot disagree.
 *
 * Changes are written with `replace`, so a search is shareable without flooding
 * the back button.
 *
 * The free-text matching itself lives in `../utils/locationUtils`; this hook
 * only derives state from the URL and serialises changes back to it.
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
  const [searchParams, setSearchParams] = useSearchParams()

  // Derived, never mirrored: a new search string is a new set of filters.
  const filters = useMemo(() => parseLocationFilters(searchParams), [searchParams])

  /**
   * Writes a change back to the URL. The recipe is handed the filters as they
   * are *now*, which is why this can use the functional form of `setSearchParams`
   * instead of closing over `filters` and rebuilding it on every render.
   */
  const commit = useCallback(
    (recipe: (current: LocationFilters) => LocationFilters) => {
      setSearchParams((current) => serialiseLocationFilters(recipe(parseLocationFilters(current))), {
        replace: true,
      })
    },
    [setSearchParams],
  )

  // Tidies a hand-typed or legacy link once on arrival. Guarded by an inequality
  // so it stops immediately once the URL is canonical, which is also what stops
  // it fighting back or forward — those never need rewriting.
  useEffect(() => {
    const canonical = serialiseLocationFilters(filters)
    if (canonical.toString() !== searchParams.toString()) setSearchParams(canonical, { replace: true })
  }, [filters, searchParams, setSearchParams])

  const setQuery = useCallback((value: string) => commit((current) => ({ ...current, query: value })), [commit])

  const setCategory = useCallback(
    (value: LocationCategoryValue) => commit((current) => ({ ...current, category: value })),
    [commit],
  )

  const removeFilter = useCallback(
    (field?: keyof LocationFilters) =>
      commit((current) =>
        field ? { ...current, [field]: defaultLocationFilters[field] } : defaultLocationFilters,
      ),
    [commit],
  )

  const reset = useCallback(() => commit(() => defaultLocationFilters), [commit])

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
