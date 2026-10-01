import { properties } from '@/data/properties'
import {
  fetchProperties,
  preloadProperties,
  readProperties,
  type PropertyListingPage,
} from '@/data/propertyRepository'
import { getAllLocations } from '@/features/locations/services/locationService'
import { defaultFilters } from '@/shared/lib/propertyQuery'
import type { PropertyFilters } from '@/types'
import { buyCategorySeeds } from '@/features/buy/data/buyData'
import type { BuyCatalogue, BuyCategory, BuyLocation } from '@/features/buy/types/buy.types'

export { BUY_FEATURED_LIMIT, BUY_HERO_IMAGE } from '@/features/buy/data/buyData'

/**
 * Buy page data source.
 *
 * A single feature that reads two existing sources rather than owning data of
 * its own:
 *
 *  - the **shared properties catalogue** — the same rows `/properties` lists,
 *    requested with `purpose=buy`. The categories, the area counts and the
 *    featured grid all come from here, so a number on this page and the number
 *    of results behind its link can never disagree.
 *  - the **Locations feature's catalogue** — for the six areas and the mapping
 *    from each area to its property-catalogue slugs. "All of Lekki" is six rows
 *    in the properties catalogue; the area card needs that mapping to exist
 *    once, and it lives where Locations owns it.
 *
 * Everything is cached under a stable key, mirroring the other services, so
 * `routeManifest` can preload this page and the page's hook finds its responses
 * already in memory and paints on the first frame.
 *
 * When PostgreSQL arrives,
 *
 *   GET /api/buy/catalogue  → categories + per-area counts + total
 *   GET /api/properties     → the featured grid
 *
 * with the counts becoming `COUNT(*)` aggregates — and nothing above this
 * service changes.
 */

/** Simulated round-trip so loading/error states are exercised realistically. */
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

const CATALOGUE_QUERY_KEY = 'buy:catalogue'

function readCache<T>(key: string): T | undefined {
  return responseCache.get(key) as T | undefined
}

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

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                   */
/* -------------------------------------------------------------------------- */

/** Every sample listing available for sale, in one derived pass. */
const saleProperties = properties.filter((property) => property.purpose === 'buy')

function countForCategory(category: Pick<BuyCategory, 'propertyType'>): number {
  return saleProperties.filter((property) => property.propertyType === category.propertyType).length
}

function countForAreaSlugs(areaSlugs: readonly string[]): number {
  return saleProperties.filter((property) => areaSlugs.includes(property.location.slug)).length
}

/**
 * Assembles the whole catalogue — categories, per-area counts and the total.
 *
 * The two numbers on each card are computed from the same sale catalogue the
 * cards link into, so this page can never advertise a count its links won't
 * deliver.
 */
export function getBuyCatalogue(): Promise<BuyCatalogue> {
  return fetchOnce(CATALOGUE_QUERY_KEY, async () => {
    await delay(MOCK_LATENCY_MS)

    const areas = await getAllLocations()

    const categories: BuyCategory[] = buyCategorySeeds.map((seed) => ({
      ...seed,
      count: countForCategory(seed),
    }))

    const locations: BuyLocation[] = areas.map((area) => ({
      id: area.id,
      slug: area.slug,
      name: area.name,
      label: area.label,
      description: area.description,
      image: area.image,
      propertyLocationSlugs: area.propertyLocationSlugs,
      forSaleCount: countForAreaSlugs(area.propertyLocationSlugs),
    }))

    return {
      categories,
      locations,
      totalForSale: saleProperties.length,
    }
  })
}

/** Cached catalogue, or `undefined`. Read during render by the hook. */
export function readBuyCatalogue(): BuyCatalogue | undefined {
  return readCache<BuyCatalogue>(CATALOGUE_QUERY_KEY)
}

/** Warms the catalogue so the page paints on its first frame. */
export function preloadBuyCatalogue(): Promise<BuyCatalogue> {
  return getBuyCatalogue()
}

/* -------------------------------------------------------------------------- */
/* Featured sale properties                                                    */
/* -------------------------------------------------------------------------- */

/** The exact query the featured grid renders — shared with the preloader. */
export const FEATURED_BUY_FILTERS: PropertyFilters = {
  ...defaultFilters,
  purpose: 'buy',
  statuses: ['featured'],
}

/**
 * The featured grid lives on the shared properties repository, not a Buy-owned
 * cache: it renders the same `PropertyCard` the listing page renders, so it
 * reuses that feature's query vocabulary end to end. The filter above is the
 * whole contract — change it here and the preloader and the grid stay in lockstep.
 */
export function getFeaturedBuyProperties(limit: number): Promise<PropertyListingPage> {
  return fetchProperties({ filters: FEATURED_BUY_FILTERS, sort: 'newest', page: 1, perPage: limit })
}

/** Cached featured page (seeded during render) or `undefined`. */
export function readFeaturedBuyProperties(limit: number): PropertyListingPage | undefined {
  return readProperties({
    filters: FEATURED_BUY_FILTERS,
    sort: 'newest',
    page: 1,
    perPage: limit,
  })
}

/** Warms the repository so the featured grid paints on the first frame. */
export function preloadFeaturedBuyProperties(limit: number): Promise<PropertyListingPage> {
  return preloadProperties({
    filters: FEATURED_BUY_FILTERS,
    sort: 'newest',
    page: 1,
    perPage: limit,
  })
}