import { primeLocations } from '@/features/projects/data/projectOptions'
import { projects } from '@/features/projects/data/projects'
import type { Project, ProjectFilters, ProjectLocationSummary } from '@/features/projects/types/projectTypes'
import {
  countProjectsByLocation,
  filterProjects,
  projectDetailQueryKey,
  projectQueryKey,
  sortProjects,
} from '@/features/projects/utils/projectUtils'

/**
 * Projects data source.
 *
 * This module is the single seam between the Projects UI and where its data
 * comes from. It already speaks the shape the Express API will expose, so
 * replacing each body with a `fetch('/api/projects?...')` call requires no change
 * to any component, hook or filter helper above it.
 *
 * Query parameters deliberately mirror the planned endpoint:
 *
 *   GET /api/projects?location=lekki-phase-1&type=residential&status=ongoing&q=heights
 *   GET /api/projects?featured=true
 *   GET /api/projects/:slug
 *
 * Responses are cached under the same key the hooks use, for the same reason the
 * properties repository caches: `routeManifest` awaits a preload before a route
 * commits, so the page's hook finds its data already in memory and paints real
 * content on the first frame instead of flashing skeletons.
 */

/** Simulated round-trip so loading and error states are exercised realistically. */
const MOCK_LATENCY_MS = 160

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

/** Resolved responses only. Never holds a promise — see `fetchOnce`. */
const responseCache = new Map<string, unknown>()

/** Requests still in flight, so concurrent callers share one call. */
const pendingRequests = new Map<string, Promise<unknown>>()

/**
 * Cached value for a query key, or `undefined` when nothing is cached yet.
 *
 * Hooks call this *during render* to mount already-populated, so it must only
 * ever return settled data. In-flight requests live in `pendingRequests` and are
 * deliberately invisible here — returning a promise here would hand a hook an
 * object where it expects an array.
 */
function readCache<T>(key: string): T | undefined {
  return responseCache.get(key) as T | undefined
}

/**
 * Cached value or a fresh load, whichever comes first.
 *
 * Two maps, because the two jobs conflict. `pendingRequests` deduplicates a
 * preload racing the page's own hook, while `responseCache` holds the settled
 * value so the *next* mount reads it synchronously and skips its skeletons
 * entirely. Collapsing them into one map either leaks a promise to a render or
 * loses the deduplication.
 *
 * Both must be consulted: `responseCache` first, so a repeat request is answered
 * from memory and callers keep a stable array reference, and `pendingRequests`
 * second, so two overlapping requests still share one call.
 */
function fetchOnce<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (responseCache.has(key)) return Promise.resolve(responseCache.get(key) as T)

  const pending = pendingRequests.get(key) as Promise<T> | undefined
  if (pending) return pending

  const request = load()
    .then((value) => {
      responseCache.set(key, value)
      return value
    })
    .finally(() => {
      pendingRequests.delete(key)
    })

  pendingRequests.set(key, request)

  return request
}

export interface GetProjectsParams {
  filters?: Partial<ProjectFilters>
  /** Restricts the result to developments flagged as featured. */
  featuredOnly?: boolean
}

function resolveFilters(filters: Partial<ProjectFilters>): ProjectFilters {
  return {
    query: filters.query ?? '',
    location: filters.location ?? '',
    projectType: filters.projectType ?? 'all',
    status: filters.status ?? 'all',
  }
}

/**
 * Returns a filtered, sorted slice of the demo catalogue.
 *
 * Today the work happens here in memory; once the API exists the same arguments
 * become query parameters and the returned array becomes a response body.
 */
export function getProjects({ filters = {}, featuredOnly = false }: GetProjectsParams = {}): Promise<Project[]> {
  const resolved = resolveFilters(filters)

  // The featured-only call is a different query, so it gets its own key rather
  // than colliding with the unfiltered listing the grid uses.
  const key = featuredOnly ? `${projectQueryKey(resolved)}&featured=true` : projectQueryKey(resolved)

  return fetchOnce(key, async () => {
    await delay(MOCK_LATENCY_MS)

    const matched = filterProjects(projects, resolved)
    const scoped = featuredOnly ? matched.filter((project) => project.isFeatured) : matched

    return sortProjects(scoped)
  })
}

/** Cached listing for a filter set, or `undefined`. Read during render by hooks. */
export function readProjects(filters: ProjectFilters): Project[] | undefined {
  return readCache<Project[]>(projectQueryKey(filters))
}

/**
 * Warms the listing cache for a filter set.
 *
 * Called by `routeManifest` before `/projects` commits, so the grid renders with
 * its results rather than six skeletons.
 */
export function preloadProjects(filters: ProjectFilters): Promise<Project[]> {
  return getProjects({ filters })
}

/**
 * Single development for the detail page.
 *
 * Mirrors `GET /api/projects/:slug`: an unknown slug resolves to `null` rather
 * than rejecting, so the caller renders a not-found state instead of treating a
 * missing record as a transport failure.
 */
export function getProjectBySlug(slug: string): Promise<Project | null> {
  return fetchOnce(projectDetailQueryKey(slug), async () => {
    await delay(MOCK_LATENCY_MS)

    return projects.find((project) => project.slug === slug) ?? null
  })
}

/** Cached project record, or `undefined`. Read during render by `useProject`. */
export function readProjectBySlug(slug: string): Project | null | undefined {
  return readCache<Project | null>(projectDetailQueryKey(slug))
}

/** Warms the detail cache so the page paints its hero on the first frame. */
export function preloadProjectBySlug(slug: string): Promise<Project | null> {
  return getProjectBySlug(slug)
}

/** The development promoted above the grid. */
export function getFeaturedProject(): Promise<Project | null> {
  return fetchOnce('project:featured', async () => {
    await delay(MOCK_LATENCY_MS)

    return projects.find((project) => project.isFeatured) ?? null
  })
}

/** Cached featured development, or `undefined`. */
export function readFeaturedProject(): Project | null | undefined {
  return readCache<Project | null>('project:featured')
}

/**
 * Promoted locations with their development counts.
 *
 * The counts are derived from the catalogue, so they stay correct as the data
 * changes. When the API is live this becomes a grouped aggregate
 * (`GROUP BY location_slug`) returned alongside the location records.
 */
export function getProjectLocations(): Promise<ProjectLocationSummary[]> {
  return fetchOnce('project:locations', async () => {
    await delay(MOCK_LATENCY_MS)

    const counts = countProjectsByLocation(projects)

    return primeLocations.map((location) => ({
      slug: location.slug,
      name: location.name,
      city: location.city,
      state: location.state,
      label: location.label,
      description: location.description,
      image: location.image,
      projectCount: counts.get(location.slug) ?? 0,
    }))
  })
}

/** Cached locations, or `undefined`. */
export function readProjectLocations(): ProjectLocationSummary[] | undefined {
  return readCache<ProjectLocationSummary[]>('project:locations')
}

/**
 * Development counts keyed by the catalogue's own location slug.
 *
 * Aggregates rather than a lookup table, because the two features that need it
 * key it differently: the Projects page filters by `locationSlug`, while the
 * Locations page groups by area — and Lekki spans several catalogue slugs
 * (`lekki-phase-1`, `gupe`, `chevron`, …). Exposing the raw counts here means
 * the grouping rule stays with the feature that owns the area definitions
 * instead of leaking into this one.
 *
 * Replaces `countProjectsByLocation` as the public entry point; that helper
 * remains for in-catalogue callers that want a `Map`.
 */
export function getProjectCountsByLocationSlug(): Promise<Record<string, number>> {
  return fetchOnce('project:counts', async () => {
    await delay(MOCK_LATENCY_MS)

    return Object.fromEntries(countProjectsByLocation(projects))
  })
}

/** Cached counts, or `undefined`. */
export function readProjectCountsByLocationSlug(): Record<string, number> | undefined {
  return readCache<Record<string, number>>('project:counts')
}

/** Warms the counts cache — used by the locations page preloader. */
export function preloadProjectCounts(): Promise<Record<string, number>> {
  return getProjectCountsByLocationSlug()
}


/** Total number of developments, used for the page's summary line. */
export async function getProjectCount(): Promise<number> {
  await delay(MOCK_LATENCY_MS)

  return projects.length
}

/**
 * The unfiltered catalogue, for other features that need to present
 * developments alongside their own data.
 *
 * The Locations page is the case in point: it groups developments under the area
 * they sit in, and that grouping rule belongs here — an area like Lekki spans
 * several of the catalogue's location slugs. Exposing the records rather than a
 * pre-grouped shape keeps the rule in one place and avoids a second list of
 * developments anywhere else in the app.
 */
export function getAllProjects(): Promise<Project[]> {
  return fetchOnce('project:all', async () => {
    await delay(MOCK_LATENCY_MS)

    return sortProjects(projects)
  })
}

/** Cached full catalogue, or `undefined`. */
export function readAllProjects(): Project[] | undefined {
  return readCache<Project[]>('project:all')
}

/** Warms the full catalogue — used by the locations page preloader. */
export function preloadAllProjects(): Promise<Project[]> {
  return getAllProjects()
}
