import {
  projectStatusFilterLabels,
  projectStatusLabels,
  projectStatuses,
  projectTypeLabels,
  projectTypes,
} from '@/features/projects/data/projectOptions'
import type {
  ActiveProjectFilter,
  Project,
  ProjectFilters,
  ProjectStatusFilter,
  ProjectTypeFilter,
} from '@/features/projects/types/projectTypes'

/**
 * The project query layer.
 *
 * Everything here is a pure function over plain data: no React, no JSX and no
 * access to the mock collection. That is deliberate — when the backend arrives,
 * `GET /api/projects` accepts exactly these parameters and returns pre-filtered
 * rows, so these functions become a client-side cache (or disappear entirely)
 * without a single component changing.
 */

/* -------------------------------------------------------------------------- */
/* Defaults and URL keys                                                       */
/* -------------------------------------------------------------------------- */

/** Query-string keys. Centralised so parsing and serialising cannot drift. */
export const projectFilterParams = {
  query: 'q',
  location: 'location',
  projectType: 'type',
  status: 'status',
} as const

/** The unfiltered state — also the target of "Clear Filters". */
export const defaultProjectFilters: ProjectFilters = {
  query: '',
  location: '',
  projectType: 'all',
  status: 'all',
}

/* -------------------------------------------------------------------------- */
/* URL <-> state                                                               */
/* -------------------------------------------------------------------------- */

function readEnum<T extends string>(query: URLSearchParams, key: string, allowed: readonly T[], fallback: T): T {
  const value = query.get(key)
  return value !== null && allowed.includes(value as T) ? (value as T) : fallback
}

/**
 * Rebuilds the filter state from a query string.
 *
 * Unknown values fall back to the default rather than throwing, so a stale
 * bookmark or a hand-edited URL can never break the page.
 */
export function parseProjectFilters(query: URLSearchParams): ProjectFilters {
  return {
    query: query.get(projectFilterParams.query)?.trim() ?? '',
    location: query.get(projectFilterParams.location)?.trim() ?? '',
    projectType: readEnum<ProjectTypeFilter>(
      query,
      projectFilterParams.projectType,
      ['all', ...projectTypes],
      'all',
    ),
    status: readEnum<ProjectStatusFilter>(query, projectFilterParams.status, ['all', ...projectStatuses], 'all'),
  }
}

/**
 * Serialises the filter state to a query string.
 * Defaults are omitted so shared links stay short and readable.
 */
export function serialiseProjectFilters(filters: ProjectFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.query) params.set(projectFilterParams.query, filters.query)
  if (filters.location) params.set(projectFilterParams.location, filters.location)
  if (filters.projectType !== defaultProjectFilters.projectType) {
    params.set(projectFilterParams.projectType, filters.projectType)
  }
  if (filters.status !== defaultProjectFilters.status) params.set(projectFilterParams.status, filters.status)

  return params
}

/** Stable key for a filter set — used to decide when a request must re-run. */
/**
 * Query key for a single project's requests.
 *
 * Used by `useProject` so navigating between two developments refetches without
 * the page remounting, and so a stale response for a previous slug can never be
 * written into the current one.
 *
 * The same key indexes the service's response cache, which is how
 * `routeManifest`'s preload for `/projects/:slug` ends up priming the exact query
 * the page is about to run.
 */
export function projectDetailQueryKey(slug: string): string {
  return `project:${slug}`
}

export function projectQueryKey(filters: ProjectFilters): string {
  return serialiseProjectFilters(filters).toString()
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                   */
/* -------------------------------------------------------------------------- */

function matchesSearchTerm(project: Project, term: string): boolean {
  const haystack = [
    project.name,
    project.location,
    project.city,
    project.state,
    projectTypeLabels[project.projectType],
    projectStatusLabels[project.status],
    project.summary,
    project.description,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(term)
}

/** Free-text match: every whitespace-separated term must appear somewhere. */
export function projectMatchesQuery(project: Project, query: string): boolean {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return true

  return trimmed.split(/\s+/).filter(Boolean).every((term) => matchesSearchTerm(project, term))
}

export function projectMatchesFilters(project: Project, filters: ProjectFilters): boolean {
  if (!projectMatchesQuery(project, filters.query)) return false
  if (filters.location && project.locationSlug !== filters.location) return false
  if (filters.projectType !== 'all' && project.projectType !== filters.projectType) return false
  if (filters.status !== 'all' && project.status !== filters.status) return false

  return true
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  return projects.filter((project) => projectMatchesFilters(project, filters))
}

/**
 * Default catalogue order: newest announcement first.
 *
 * Sorting in one place means the service can return a ready-to-render list and
 * the grid never has to know why a project appears where it does.
 */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
  )
}

/* -------------------------------------------------------------------------- */
/* Derived views                                                               */
/* -------------------------------------------------------------------------- */

/** Location select options, derived from whichever projects are in the result. */
export function getProjectLocationOptions(projects: Project[]): { value: string; label: string }[] {
  const bySlug = new Map<string, string>()

  for (const project of projects) {
    if (!bySlug.has(project.locationSlug)) bySlug.set(project.locationSlug, project.location)
  }

  return [...bySlug.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/** How many developments sit in each location, keyed by location slug. */
export function countProjectsByLocation(projects: Project[]): Map<string, number> {
  const counts = new Map<string, number>()

  for (const project of projects) {
    counts.set(project.locationSlug, (counts.get(project.locationSlug) ?? 0) + 1)
  }

  return counts
}

/**
 * Completion percentage, or null when no live progress applies.
 * Completed and not-yet-started developments deliberately return null so the UI
 * never shows a stale progress bar.
 */
export function getProjectProgressPercent(project: Project): number | null {
  if (project.status !== 'ongoing') return null
  if (project.progress === null) return null

  return Math.min(100, Math.max(0, Math.round(project.progress)))
}

/** "24 units available" / "1 unit available" */
export function formatAvailableUnits(count: number): string {
  return `${count.toLocaleString('en-NG')} ${count === 1 ? 'unit' : 'units'} available`
}

/**
 * Other developments to suggest alongside this one: same location first, then
 * the same category, never the project itself.
 */
export function getRelatedProjects(project: Project, projects: Project[], limit = 3): Project[] {
  return projects
    .filter((candidate) => candidate.id !== project.id)
    .sort((a, b) => {
      const score = (candidate: Project) =>
        (candidate.locationSlug === project.locationSlug ? 2 : 0) +
        (candidate.projectType === project.projectType ? 1 : 0)

      return score(b) - score(a) || b.createdAt.localeCompare(a.createdAt)
    })
    .slice(0, limit)
}

/* -------------------------------------------------------------------------- */
/* Filter metadata                                                             */
/* -------------------------------------------------------------------------- */

/** True when any facet differs from the default state. */
export function hasActiveProjectFilters(filters: ProjectFilters): boolean {
  return (
    filters.query !== '' ||
    filters.location !== '' ||
    filters.projectType !== 'all' ||
    filters.status !== 'all'
  )
}

/**
 * Flattens the filter state into removable chips.
 * `resolveLocationLabel` is injected so this module stays free of data imports.
 */
export function describeActiveProjectFilters(
  filters: ProjectFilters,
  resolveLocationLabel: (slug: string) => string,
): ActiveProjectFilter[] {
  const chips: ActiveProjectFilter[] = []

  if (filters.query) {
    chips.push({ id: 'query', label: `“${filters.query}”`, field: 'query' })
  }

  if (filters.location) {
    chips.push({ id: 'location', label: resolveLocationLabel(filters.location), field: 'location' })
  }

  if (filters.projectType !== 'all') {
    chips.push({
      id: 'projectType',
      label: projectTypeLabels[filters.projectType],
      field: 'projectType',
    })
  }

  if (filters.status !== 'all') {
    chips.push({
      id: 'status',
      label: projectStatusFilterLabels[filters.status as ProjectStatusFilter] as string,
      field: 'status',
    })
  }

  return chips
}

/** Human label for a single filter field, used by the chip summary. */
export function describeProjectFilterField(field: keyof ProjectFilters): string {
  switch (field) {
    case 'query':
      return 'Search'
    case 'location':
      return 'Location'
    case 'projectType':
      return 'Project Type'
    case 'status':
      return 'Status'
  }
}
