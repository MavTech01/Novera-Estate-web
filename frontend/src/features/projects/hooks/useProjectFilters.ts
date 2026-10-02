import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { primeLocations } from '@/features/projects/data/projectOptions'
import { projects } from '@/features/projects/data/projects'
import type {
  ActiveProjectFilter,
  ProjectFilters,
  ProjectStatusFilter,
  ProjectTypeFilter,
} from '@/features/projects/types/projectTypes'
import {
  defaultProjectFilters,
  describeActiveProjectFilters,
  getProjectLocationOptions,
  hasActiveProjectFilters,
  parseProjectFilters,
  serialiseProjectFilters,
} from '@/features/projects/utils/projectUtils'

/**
 * Owns every piece of project filter state and keeps the URL in sync.
 *
 * The URL is the source of truth: `useSearchParams` is reactive, so a deep link
 * such as `/projects?location=lekki-phase-1`, a location card, and the browser
 * back button are all the same event as a filter click here. Nothing mirrors the
 * filters into component state, so the category strip, the hero form and the
 * mobile drawer cannot disagree.
 *
 * Changes are written with `replace`, so filters are shareable without flooding
 * the back button.
 */

/**
 * Location labels come from the catalogue so the select, the chips and the
 * "Prime Locations" cards all name a location identically. This is label-only
 * metadata; once the API is live it becomes the `location` facet returned with
 * the results.
 */
const locationLabels = new Map<string, string>([
  ...primeLocations.map((location) => [location.slug, location.label] as const),
  ...projects.map((project) => [project.locationSlug, project.location] as const),
])

function resolveLocationLabel(slug: string): string {
  return locationLabels.get(slug) ?? slug
}

export interface ProjectFiltersController {
  filters: ProjectFilters
  /** Removable summary of every applied filter. */
  activeFilters: ActiveProjectFilter[]
  /** Number of individual filters applied — drives the "Filters (n)" badge. */
  activeCount: number
  isFiltered: boolean
  /** Options for the location select, ordered alphabetically. */
  locationOptions: { value: string; label: string }[]
  setQuery: (query: string) => void
  setLocation: (location: string) => void
  setProjectType: (projectType: ProjectTypeFilter) => void
  setStatus: (status: ProjectStatusFilter) => void
  /** Clears one facet, or the lot when no filter is passed. */
  removeFilter: (field?: keyof ProjectFilters) => void
  reset: () => void
}

export function useProjectFilters(): ProjectFiltersController {
  const [searchParams, setSearchParams] = useSearchParams()

  // Derived, never mirrored: a new search string is a new set of filters.
  const filters = useMemo(() => parseProjectFilters(searchParams), [searchParams])

  /** Writes a change back to the URL, seeing the filters as they are now. */
  const commit = useCallback(
    (recipe: (current: ProjectFilters) => ProjectFilters) => {
      setSearchParams((current) => serialiseProjectFilters(recipe(parseProjectFilters(current))), {
        replace: true,
      })
    },
    [setSearchParams],
  )

  // Tidies a hand-typed or legacy link once on arrival. Guarded by an inequality
  // so it stops once the URL is canonical, which is also what keeps it from
  // fighting back or forward — those never need rewriting.
  useEffect(() => {
    const canonical = serialiseProjectFilters(filters)
    if (canonical.toString() !== searchParams.toString()) setSearchParams(canonical, { replace: true })
  }, [filters, searchParams, setSearchParams])

  const setQuery = useCallback((value: string) => commit((current) => ({ ...current, query: value })), [commit])

  const setLocation = useCallback(
    (value: string) => commit((current) => ({ ...current, location: value })),
    [commit],
  )

  const setProjectType = useCallback(
    (value: ProjectTypeFilter) => commit((current) => ({ ...current, projectType: value })),
    [commit],
  )

  const setStatus = useCallback(
    (value: ProjectStatusFilter) => commit((current) => ({ ...current, status: value })),
    [commit],
  )

  const removeFilter = useCallback(
    (field?: keyof ProjectFilters) =>
      commit((current) =>
        field ? { ...current, [field]: defaultProjectFilters[field] } : defaultProjectFilters,
      ),
    [commit],
  )

  const reset = useCallback(() => commit(() => defaultProjectFilters), [commit])

  const activeFilters = useMemo(
    () => describeActiveProjectFilters(filters, resolveLocationLabel),
    [filters],
  )

  // The location list describes the whole catalogue, not the filtered result,
  // so narrowing one facet never removes options from another.
  const locationOptions = useMemo(() => getProjectLocationOptions(projects), [])

  return {
    filters,
    activeFilters,
    activeCount: activeFilters.length,
    isFiltered: hasActiveProjectFilters(filters),
    locationOptions,
    setQuery,
    setLocation,
    setProjectType,
    setStatus,
    removeFilter,
    reset,
  }
}
