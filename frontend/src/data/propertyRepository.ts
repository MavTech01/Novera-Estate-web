import { filterProperties, paginate, serialiseQuery, sortProperties, type Paginated } from '@/shared/lib/propertyQuery'
import type { Property, PropertyDetail, PropertyFilters, PropertySort } from '@/types'
import { buildPropertyDetail } from './propertyDetails'
import { properties } from './properties'

/**
 * Mock property repository.
 *
 * This module is the single seam between the UI and its data source. It already
 * speaks the shape the Express API will expose, so replacing the body of
 * `fetchProperties` with `fetch('/api/properties?...')` requires no change to
 * any component, hook or filter helper above it.
 *
 * Query parameters deliberately mirror the planned endpoint:
 *   GET /api/properties
 *     ?purpose=buy&type=house&location=lekki&minPrice=50000000&maxPrice=200000000
 *     &bedrooms=4&bathrooms=3&status=featured&feature=parking&sort=price-asc&page=1&limit=6
 *
 *   GET /api/properties/:slug
 *
 * Every function comes in three flavours, which is what makes a route
 * transition seamless:
 *   - `read*`      — synchronous cache probe: cached value, or `undefined`
 *   - `preload*`   — resolves once the data is in the cache, de-duplicated
 *   - `fetch*`     — the request itself, also used by the page-level hooks
 *
 * The route transition preloads; the page hook then finds its data already in
 * the cache and renders content on its first frame instead of a skeleton.
 */

export interface PropertyListingQuery {
  filters: PropertyFilters
  sort?: PropertySort
  page?: number
  perPage?: number
}

/** One page of results — matches a future `PaginatedPropertiesResponse`. */
export type PropertyListingPage = Paginated<Property>

/** Simulated round-trip so loading and error states are exercised realistically. */
const MOCK_LATENCY_MS = 450

/** Bounds on the caches, so a long browsing session cannot grow them forever. */
const DETAIL_CACHE_LIMIT = 12
const LISTING_CACHE_LIMIT = 24

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

function trim<T>(cache: Map<string, T>, limit: number): void {
  while (cache.size > limit) {
    const oldest = cache.keys().next()
    if (oldest.done) return
    cache.delete(oldest.value)
  }
}

/* -------------------------------------------------------------------------- */
/* Single listing                                                              */
/* -------------------------------------------------------------------------- */

/**
 * `undefined` means "not in the cache yet" — which is what lets a page tell the
 * difference between "still loading" and "loaded, and there is no such listing".
 */
const detailCache = new Map<string, PropertyDetail | null>()

export function readPropertyBySlug(slug: string): PropertyDetail | null | undefined {
  return detailCache.get(slug)
}

export async function fetchPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  const cached = detailCache.get(slug)
  if (cached !== undefined) return cached

  await delay(MOCK_LATENCY_MS)

  const property = properties.find((item) => item.slug === slug)
  const detail = property ? buildPropertyDetail(property) : null

  detailCache.set(slug, detail)
  trim(detailCache, DETAIL_CACHE_LIMIT)

  return detail
}

const detailRequests = new Map<string, Promise<PropertyDetail | null>>()

/** Warms the cache for a slug. Concurrent callers share one request. */
export function preloadPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  if (detailCache.has(slug)) return Promise.resolve(detailCache.get(slug) ?? null)

  const inFlight = detailRequests.get(slug)
  if (inFlight) return inFlight

  const request = fetchPropertyBySlug(slug).finally(() => {
    detailRequests.delete(slug)
  })

  detailRequests.set(slug, request)

  return request
}

/* -------------------------------------------------------------------------- */
/* Listing                                                                     */
/* -------------------------------------------------------------------------- */

const listingCache = new Map<string, PropertyListingPage>()

function listingCacheKey({
  filters,
  sort = 'newest',
  page = 1,
  perPage = 6,
}: PropertyListingQuery): string {
  return `${serialiseQuery(filters, sort, page).toString()}&perPage=${perPage}`
}

export function readProperties(query: PropertyListingQuery): PropertyListingPage | undefined {
  return listingCache.get(listingCacheKey(query))
}

export async function fetchProperties({
  filters,
  sort = 'newest',
  page = 1,
  perPage = 6,
}: PropertyListingQuery): Promise<PropertyListingPage> {
  const key = listingCacheKey({ filters, sort, page, perPage })
  const cached = listingCache.get(key)
  if (cached) return cached

  await delay(MOCK_LATENCY_MS)

  const matched = filterProperties(properties, filters)
  const result = paginate(sortProperties(matched, sort), page, perPage)

  listingCache.set(key, result)
  trim(listingCache, LISTING_CACHE_LIMIT)

  return result
}

const listingRequests = new Map<string, Promise<PropertyListingPage>>()

/** Warms the cache for a listing query. Concurrent callers share one request. */
export function preloadProperties(query: PropertyListingQuery): Promise<PropertyListingPage> {
  const key = listingCacheKey(query)

  const cached = listingCache.get(key)
  if (cached) return Promise.resolve(cached)

  const inFlight = listingRequests.get(key)
  if (inFlight) return inFlight

  const request = fetchProperties(query).finally(() => {
    listingRequests.delete(key)
  })

  listingRequests.set(key, request)

  return request
}