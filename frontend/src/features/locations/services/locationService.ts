import { getProjectCountsByLocationSlug } from '@/features/projects/services/projectService'
import { featuredLocationSeed, locationSeedsExpanded } from '@/features/locations/data/locations'
import type { Location, LocationFilters } from '@/features/locations/types/locationTypes'
import {
  filterLocations,
  locationDetailQueryKey,
  locationQueryKey,
  rankLocationMatches,
  sortLocations,
} from '@/features/locations/utils/locationUtils'

/**
 * Locations data source.
 *
 * This module is the single seam between the Locations UI and where its data
 * comes from. It already speaks the shape the Express API will expose, so
 * replacing each body with a `fetch('/api/locations?...')` call requires no change
 * to any component, hook or filter helper above it.
 *
 * Query parameters deliberately mirror the planned endpoints:
 *
 *   GET /api/locations?q=lekki&category=island
 *   GET /api/locations?featured=true
 *   GET /api/locations/:slug
 *
 * Responses are cached under the same key the hooks use, for the same reason the
 * projects service caches: `routeManifest` awaits a preload before a route
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

function resolveFilters(filters: Partial<LocationFilters>): LocationFilters {
  return {
    query: filters.query ?? '',
    category: filters.category ?? 'all',
  }
}

/**
 * Resolves the demo catalogue into full `Location` records.
 *
 * The only field the seed data does not carry is `projectCount`, and it is
 * deliberately borrowed from the Projects feature rather than duplicated: a
 * card badge and the "Developments by Location" list below it would otherwise
 * be two hand-maintained numbers for the same fact.
 *
 * Lekki spans six catalogue slugs, so the counts are summed across
 * `propertyLocationSlugs` rather than read for the area's own name.
 */
async function resolveLocations(): Promise<Location[]> {
  const counts = await getProjectCountsByLocationSlug()

  return locationSeedsExpanded.map((location) => {
    const projectCount = location.propertyLocationSlugs.reduce(
      (total, slug) => total + (counts[slug] ?? 0),
      0,
    )

    return { ...location, projectCount }
  })
}

/* -------------------------------------------------------------------------- */
/* Listing                                                                     */
/* -------------------------------------------------------------------------- */

export interface GetLocationsParams {
  filters?: Partial<LocationFilters>
  /** Restricts the result to areas flagged as featured. */
  featuredOnly?: boolean
}

/**
 * Returns a filtered, ranked slice of the catalogue.
 *
 * Today the work happens here in memory; once the API exists the same arguments
 * become query parameters and the returned array becomes a response body.
 */
export function getLocations({ filters = {}, featuredOnly = false }: GetLocationsParams = {}): Promise<Location[]> {
  const resolved = resolveFilters(filters)

  // The featured-only call is a different query, so it gets its own key rather
  // than colliding with the unfiltered listing the grid uses.
  const key = featuredOnly ? `${locationQueryKey(resolved)}&featured=true` : locationQueryKey(resolved)

  return fetchOnce(key, async () => {
    await delay(MOCK_LATENCY_MS)

    const all = await resolveLocations()
    const matched = filterLocations(all, resolved)
    const scoped = featuredOnly ? matched.filter((location) => location.isFeatured) : matched

    // Ranking rather than plain sorting: an unfiltered page and a searched one
    // want different orders, and only the search knows which is which.
    return resolved.query ? rankLocationMatches(scoped, resolved.query) : sortLocations(scoped)
  })
}

/** Cached listing for a filter set, or `undefined`. Read during render by hooks. */
export function readLocations(filters: LocationFilters): Location[] | undefined {
  return readCache<Location[]>(locationQueryKey(filters))
}

/**
 * Warms the listing cache for a filter set.
 *
 * Called by `routeManifest` before `/locations` commits, so the grid renders
 * with its results rather than six skeletons.
 */
export function preloadLocations(filters: LocationFilters): Promise<Location[]> {
  return getLocations({ filters })
}

/* -------------------------------------------------------------------------- */
/* Single location                                                             */
/* -------------------------------------------------------------------------- */

/**
 * One area for the detail page.
 *
 * Mirrors `GET /api/locations/:slug`: an unknown slug resolves to `null` rather
 * than rejecting, so the caller renders a not-found state instead of treating a
 * missing record as a transport failure.
 */
export function getLocationBySlug(slug: string): Promise<Location | null> {
  return fetchOnce(locationDetailQueryKey(slug), async () => {
    await delay(MOCK_LATENCY_MS)

    const locations = await resolveLocations()

    return locations.find((location) => location.slug === slug) ?? null
  })
}

/** Cached location record, or `undefined`. Read during render by `useLocation`. */
export function readLocationBySlug(slug: string): Location | null | undefined {
  return readCache<Location | null>(locationDetailQueryKey(slug))
}

/** Warms the detail cache so the page paints its hero on the first frame. */
export function preloadLocationBySlug(slug: string): Promise<Location | null> {
  return getLocationBySlug(slug)
}

/** The area promoted in the featured block. */
export function getFeaturedLocation(): Promise<Location | null> {
  return fetchOnce('location:featured', async () => {
    await delay(MOCK_LATENCY_MS)

    const locations = await resolveLocations()
    const slug = featuredLocationSeed.slug

    return locations.find((location) => location.slug === slug) ?? null
  })
}

/** Cached featured location, or `undefined`. */
export function readFeaturedLocation(): Location | null | undefined {
  return readCache<Location | null>('location:featured')
}

/**
 * Warms the featured area.
 *
 * It renders above the grid on first load, so it is part of the first frame the
 * route preloader is responsible for — without this it would still flash a
 * skeleton while the listing above it was already resolved.
 */
export function preloadFeaturedLocation(): Promise<Location | null> {
  return getFeaturedLocation()
}

/* -------------------------------------------------------------------------- */
/* Aggregates                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The unfiltered catalogue, for sections that describe every area at once
 * (the map, the comparison table, the "Properties by Location" list).
 *
 * Keyed separately from the unfiltered listing so a filtered grid and these
 * sections can never interfere with each other's cache entry.
 */
export function getAllLocations(): Promise<Location[]> {
  return fetchOnce('location:all', async () => {
    await delay(MOCK_LATENCY_MS)

    return sortLocations(await resolveLocations())
  })
}

/** Cached full catalogue, or `undefined`. */
export function readAllLocations(): Location[] | undefined {
  return readCache<Location[]>('location:all')
}

/** Warms the full catalogue — used by the locations page preloader. */
export function preloadAllLocations(): Promise<Location[]> {
  return getAllLocations()
}
