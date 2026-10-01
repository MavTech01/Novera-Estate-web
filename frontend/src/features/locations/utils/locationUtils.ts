import { locationCategoryFilterLabels, locationCategories } from '@/features/locations/data/locationOptions'
import type {
  ActiveLocationFilter,
  Location,
  LocationCategoryValue,
  LocationComparisonRow,
  LocationComparisonTable,
  LocationFilters,
} from '@/features/locations/types/locationTypes'
import { buildComparisonCells, locationComparisonAttributes } from '@/features/locations/data/locationOptions'

/**
 * The location query layer.
 *
 * Everything here is a pure function over plain data: no React, no JSX and no
 * access to the demo catalogue. That is deliberate — when the backend arrives,
 * `GET /api/locations` accepts exactly these parameters and returns pre-filtered
 * rows, so these functions become a client-side cache (or disappear entirely)
 * without a single component changing.
 */

/* -------------------------------------------------------------------------- */
/* Defaults and URL keys                                                       */
/* -------------------------------------------------------------------------- */

/** Query-string keys. Centralised so parsing and serialising cannot drift. */
export const locationFilterParams = {
  query: 'q',
  category: 'category',
} as const

/** The unfiltered state — also the target of "Clear Search". */
export const defaultLocationFilters: LocationFilters = {
  query: '',
  category: 'all',
}

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
export function parseLocationFilters(query: URLSearchParams): LocationFilters {
  return {
    query: query.get(locationFilterParams.query)?.trim() ?? '',
    category: readEnum<LocationCategoryValue>(
      query,
      locationFilterParams.category,
      ['all', ...locationCategories],
      'all',
    ),
  }
}

/**
 * Serialises the filter state to a query string.
 * Defaults are omitted so shared links stay short and readable.
 */
export function serialiseLocationFilters(filters: LocationFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.query) params.set(locationFilterParams.query, filters.query)
  if (filters.category !== defaultLocationFilters.category) {
    params.set(locationFilterParams.category, filters.category)
  }

  return params
}

/** Stable key for a filter set — decides when a request must re-run. */
export function locationQueryKey(filters: LocationFilters): string {
  return serialiseLocationFilters(filters).toString()
}

/** Query key for a single location's requests. */
export function locationDetailQueryKey(slug: string): string {
  return `location:${slug}`
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Everything a free-text search should be able to match against.
 *
 * Built once per record per render pass rather than on every keystroke, and
 * cached by the service, so the search stays cheap as the catalogue grows.
 */
function searchableText(location: Location): string {
  return [
    location.name,
    location.city,
    location.state,
    location.label,
    location.regionLabel,
    location.description,
    location.longDescription,
    location.keywords.join(' '),
    location.popularPropertyTypes.join(' '),
    location.categories.join(' '),
    location.highlights.map((highlight) => `${highlight.title} ${highlight.description}`).join(' '),
    location.nearbyLandmarks.map((landmark) => landmark.label).join(' '),
  ]
    .join(' ')
    .toLowerCase()
}

/**
 * Free-text match: every whitespace-separated term must appear somewhere.
 *
 * Searching "lekki" surfaces Lekki, and searching a category word such as
 * "island" surfaces every area carrying that keyword — which is how a visitor
 * who knows what they want but not which neighbourhood it is in still finds the
 * right places.
 */
export function locationMatchesQuery(location: Location, query: string): boolean {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return true

  const haystack = searchableText(location)

  return trimmed.split(/\s+/).filter(Boolean).every((term) => haystack.includes(term))
}

export function locationMatchesFilters(location: Location, filters: LocationFilters): boolean {
  if (!locationMatchesQuery(location, filters.query)) return false
  if (filters.category !== 'all' && !location.categories.includes(filters.category)) return false

  return true
}

export function filterLocations(locations: Location[], filters: LocationFilters): Location[] {
  return locations.filter((location) => locationMatchesFilters(location, filters))
}

/**
 * Default catalogue order: featured areas first, then alphabetical.
 *
 * Sorting in one place means the service returns a ready-to-render list and the
 * grid never has to know why a location appears where it does.
 */
export function sortLocations(locations: Location[]): Location[] {
  return [...locations].sort(
    (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name),
  )
}

/* -------------------------------------------------------------------------- */
/* Derived views                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Ranks matches so the closest thing to what was typed appears first.
 *
 * A plain substring test cannot order results — searching "lekki" returns the
 * same rows in whatever order the catalogue was in. This is deliberately a small
 * heuristic rather than a search engine: an exact slug, then a name match, then
 * a label or city match, then anything else, with featured areas breaking ties.
 */
export function rankLocationMatches(locations: Location[], query: string): Location[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return sortLocations(locations)

  const score = (location: Location): number => {
    const name = location.name.toLowerCase()
    const slug = location.slug.toLowerCase()

    if (slug === trimmed || name === trimmed) return 4
    if (name.startsWith(trimmed)) return 3
    if (name.includes(trimmed) || slug.includes(trimmed)) return 2
    return 1
  }

  return [...locations].sort(
    (a, b) =>
      score(b) - score(a) ||
      Number(b.isFeatured) - Number(a.isFeatured) ||
      a.name.localeCompare(b.name),
  )
}

/** Locations carrying a given category, in catalogue order. */
export function getLocationsByCategory(locations: Location[], category: LocationCategoryValue): Location[] {
  if (category === 'all') return sortLocations(locations)

  return sortLocations(locations.filter((location) => location.categories.includes(category)))
}

/** Total sample property count across a set of locations. */
export function sumPropertyCounts(locations: Location[]): number {
  return locations.reduce((total, location) => total + location.propertyCount, 0)
}

/** Builds the comparison table from the given areas. */
export function buildComparisonTable(locations: Location[]): LocationComparisonTable {
  const rows: LocationComparisonRow[] = locationComparisonAttributes.map((attribute) => ({
    attribute,
    cells: buildComparisonCells(attribute.id, locations),
  }))

  return { locations, rows }
}

/* -------------------------------------------------------------------------- */
/* Filter metadata                                                             */
/* -------------------------------------------------------------------------- */

/** True when any facet differs from the default state. */
export function hasActiveLocationFilters(filters: LocationFilters): boolean {
  return filters.query !== '' || filters.category !== 'all'
}

/**
 * Flattens the filter state into removable chips.
 *
 * Both the search term and the category are independently removable, so a
 * visitor who searched "island" inside a category can widen it without losing
 * what they typed.
 */
export function describeActiveLocationFilters(filters: LocationFilters): ActiveLocationFilter[] {
  const chips: ActiveLocationFilter[] = []

  if (filters.query) chips.push({ id: 'query', label: `“${filters.query}”`, field: 'query' })
  if (filters.category !== 'all') {
    chips.push({
      id: 'category',
      label: locationCategoryFilterLabels[filters.category],
      field: 'category',
    })
  }

  return chips
}

/** Human label for a single filter field, used by the chip summary. */
export function describeLocationFilterField(field: keyof LocationFilters): string {
  switch (field) {
    case 'query':
      return 'Search'
    case 'category':
      return 'Category'
  }
}

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

/** "24 properties" / "1 property" */
export function formatPropertyCount(count: number): string {
  return `${count.toLocaleString('en-NG')} ${count === 1 ? 'property' : 'properties'}`
}

/** "4 developments" / "1 development" */
export function formatProjectCount(count: number): string {
  return `${count.toLocaleString('en-NG')} ${count === 1 ? 'development' : 'developments'}`
}

/** "Explore Lekki" — the call to action on a location card. */
export function locationCtaLabel(location: Pick<Location, 'name'>): string {
  return `Explore ${location.name}`
}
