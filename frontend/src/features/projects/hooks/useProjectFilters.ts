import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { replaceSearchParams, useRouter } from '@/shared/hooks/useRouter'
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
 * The URL is the single source of truth: it seeds the initial state, receives
 * every subsequent change via `replaceState` (so filters are shareable without
 * flooding the back button), and re-seeds the state when a deep link such as
 * `/projects?location=lekki-phase-1` is followed while already on this page.
 *
 * That also means the category strip, the hero form and the mobile drawer are
 * three presentations of one value — there is no second copy of the filters to
 * keep in step.
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
  const { query } = useRouter()

  const [filters, setFilters] = useState<ProjectFilters>(() => parseProjectFilters(query))

  /** The query string we last wrote ourselves, used to ignore our own echo. */
  const ownQueryKey = useRef(query.toString())

  // Adopt filter state pushed into the URL by navigation (deep links, location
  // cards) while this page is already mounted.
  const incomingQueryKey = query.toString()
  useEffect(() => {
    if (incomingQueryKey === ownQueryKey.current) return

    ownQueryKey.current = incomingQueryKey
    setFilters(parseProjectFilters(query))
    // `query` is derived from `incomingQueryKey`, which is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingQueryKey])

  // Publish state changes to the address bar.
  useEffect(() => {
    const nextQuery = serialiseProjectFilters(filters)
    ownQueryKey.current = nextQuery.toString()
    replaceSearchParams(nextQuery)
  }, [filters])

  const setQuery = useCallback((value: string) => {
    setFilters((current) => ({ ...current, query: value }))
  }, [])

  const setLocation = useCallback((value: string) => {
    setFilters((current) => ({ ...current, location: value }))
  }, [])

  const setProjectType = useCallback((value: ProjectTypeFilter) => {
    setFilters((current) => ({ ...current, projectType: value }))
  }, [])

  const setStatus = useCallback((value: ProjectStatusFilter) => {
    setFilters((current) => ({ ...current, status: value }))
  }, [])

  const removeFilter = useCallback((field?: keyof ProjectFilters) => {
    setFilters((current) =>
      field
        ? { ...current, [field]: defaultProjectFilters[field] }
        : defaultProjectFilters,
    )
  }, [])

  const reset = useCallback(() => setFilters(defaultProjectFilters), [])

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
