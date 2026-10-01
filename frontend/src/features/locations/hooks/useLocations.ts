import { useMemo } from 'react'

import {
  getAllLocations,
  getFeaturedLocation,
  getLocationBySlug,
  getLocations,
  readAllLocations,
  readFeaturedLocation,
  readLocationBySlug,
  readLocations,
} from '@/features/locations/services/locationService'
import type { Location, LocationFilters } from '@/features/locations/types/locationTypes'
import { buildComparisonTable, locationQueryKey } from '@/features/locations/utils/locationUtils'
import { EMPTY_LOCATIONS, useLocationResource } from './useLocationResource'

/**
 * Request hooks for the Locations feature.
 *
 * All of them share the `useLocationResource` lifecycle and talk to the same
 * service boundary, so replacing the demo catalogue for `GET /api/locations`
 * leaves all of them — and everything above them — unchanged.
 */

/**
 * Areas matching the current filters.
 *
 * `filters` is the object produced by `useLocationSearch`; it is reduced to a
 * serialised key so the request re-runs when the *meaning* of the filters
 * changes rather than on every render.
 */
export function useLocations(filters: LocationFilters) {
  const queryKey = useMemo(() => locationQueryKey(filters), [filters])

  return useLocationResource<Location[]>(
    () => getLocations({ filters }),
    queryKey,
    EMPTY_LOCATIONS,
    () => readLocations(filters),
  )
}

/** The whole catalogue, for the sections that describe every area at once. */
export function useAllLocations() {
  return useLocationResource<Location[]>(() => getAllLocations(), 'location:all', EMPTY_LOCATIONS, readAllLocations)
}

/** The area promoted in the featured block. */
export function useFeaturedLocation() {
  return useLocationResource<Location | null>(() => getFeaturedLocation(), 'location:featured', null, readFeaturedLocation)
}

/**
 * A single area for the future detail page.
 *
 * Returns `null` for a slug that does not exist, which is a legitimate answer
 * rather than a failure — the caller renders a not-found state.
 */
export function useLocation(slug: string) {
  return useLocationResource<Location | null>(
    () => getLocationBySlug(slug),
    `location:${slug}`,
    null,
    () => readLocationBySlug(slug),
  )
}

/**
 * The comparison table, derived from the catalogue rather than fetched.
 *
 * Built with `useMemo` off `useAllLocations` so it costs nothing until the areas
 * themselves have arrived, and never rebuilds while the user is typing in the
 * search box.
 */
export function useLocationComparison() {
  const { value: locations } = useAllLocations()

  return useMemo(() => buildComparisonTable(locations), [locations])
}
