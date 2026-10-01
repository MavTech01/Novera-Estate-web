import { useMemo } from 'react'

import {
  getAllProjects,
  getFeaturedProject,
  getProjectCountsByLocationSlug,
  getProjectLocations,
  getProjects,
  readAllProjects,
  readFeaturedProject,
  readProjectCountsByLocationSlug,
  readProjectLocations,
  readProjects,
} from '@/features/projects/services/projectService'
import type { Project, ProjectFilters, ProjectLocationSummary } from '@/features/projects/types/projectTypes'
import { projectQueryKey } from '@/features/projects/utils/projectUtils'
import { EMPTY_LOCATIONS, EMPTY_PROJECTS, useProjectResource } from './useProjectResource'

/**
 * Request hooks for the Projects *listing* surface.
 *
 * `useProject` in `./useProject` covers the detail page; all four share the
 * `useProjectResource` lifecycle and talk to the same service boundary, so
 * swapping the mock catalogue for `GET /api/projects` leaves all of them — and
 * everything above them — unchanged.
 */

/**
 * Developments matching the current filters.
 *
 * `filters` is the object produced by `useProjectFilters`; it is reduced to a
 * serialised key so the request re-runs when the *meaning* of the filters
 * changes rather than on every render.
 */
export function useProjects(filters: ProjectFilters) {
  const queryKey = useMemo(() => projectQueryKey(filters), [filters])

  return useProjectResource<Project[]>(
    () => getProjects({ filters }),
    queryKey,
    EMPTY_PROJECTS,
    () => readProjects(filters),
  )
}

/** The development promoted above the grid. */
export function useFeaturedProject() {
  return useProjectResource<Project | null>(
    () => getFeaturedProject(),
    'project:featured',
    null,
    readFeaturedProject,
  )
}

/** Promoted locations with their development counts, for the locations strip. */
export function useProjectLocations() {
  return useProjectResource<ProjectLocationSummary[]>(
    () => getProjectLocations(),
    'project:locations',
    EMPTY_LOCATIONS,
    readProjectLocations,
  )
}

/**
 * Development counts keyed by the catalogue's own location slug.
 *
 * Published for other features rather than used here: the Locations page needs
 * the same numbers to keep its "N developments" badge honest, and it groups
 * them by area itself.
 */
export function useProjectCountsByLocation() {
  return useProjectResource<Record<string, number>>(
    () => getProjectCountsByLocationSlug(),
    'project:counts',
    {},
    readProjectCountsByLocationSlug,
  )
}

/**
 * The unfiltered catalogue, for the Locations page's "Developments by Location"
 * section. Same records the grid renders, so a development shown there and here
 * can never drift apart.
 */
export function useAllProjects() {
  return useProjectResource<Project[]>(() => getAllProjects(), 'project:all', EMPTY_PROJECTS, readAllProjects)
}
