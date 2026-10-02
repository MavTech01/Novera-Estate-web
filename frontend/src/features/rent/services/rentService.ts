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
import { rentCategorySeeds } from '@/features/rent/data/rentData'
import type { RentCatalogue, RentCategory, RentLocation } from '@/features/rent/types/rent.types'

export { RENT_FEATURED_LIMIT, RENT_HERO_IMAGE } from '@/features/rent/data/rentData'

/**
 * Rent page data source.
 *
 * A single feature that reads two existing sources rather than owning data of
 * its own:
 *
 *  - the **shared properties catalogue** — the same rows `/properties` lists,
 *    requested with `purpose=rent`. The categories, the area counts and the
 *    featured grid all come from here, so a number on this page and the number
 *    of results behind its link can never disagree.
 *  - the **Locations feature's catalogue** — for the areas and the mapping from
 *    each area to its property-catalogue slugs. "All of Lekki" is six rows in
 *    the properties catalogue; the area card needs that mapping to exist once,
 *    and it lives where Locations owns it.
 *
 * Everything is cached under a stable key, mirroring the other services, so
 * `routeManifest` can preload this page and the page's hook finds its responses
 * already in memory and paints on the first frame.
 *
 * When PostgreSQL arrives,
 *
 *   GET /api/rent/catalogue  → categories + per-area counts + total
 *   GET /api/properties      → the featured grid
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

const CATALOGUE_QUERY_KEY = 'rent:catalogue'

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

/** Every sample listing available to rent, in one derived pass. */
const rentalProperties = properties.filter((property) => property.purpose === 'rent')

function countForCategory(category: Pick<RentCategory, 'propertyType'>): number {
  return rentalProperties.filter((property) => property.propertyType === category.propertyType).length
}

function countForAreaSlugs(areaSlugs: readonly string[]): number {
  return rentalProperties.filter((property) => areaSlugs.includes(property.location.slug)).length
}

/**
 * Assembles the whole catalogue — categories, per-area counts and the total.
 *
 * The two numbers on each card are computed from the same rental catalogue the
 * cards link into, so this page can never advertise a count its links won't
 * deliver.
 */
export function getRentCatalogue(): Promise<RentCatalogue> {
  return fetchOnce(CATALOGUE_QUERY_KEY, async () => {
    await delay(MOCK_LATENCY_MS)

    const areas = await getAllLocations()

    const categories: RentCategory[] = rentCategorySeeds.map((seed) => ({
      ...seed,
      count: countForCategory(seed),
    }))

    const locations: RentLocation[] = areas.map((area) => ({
      id: area.id,
      slug: area.slug,
      name: area.name,
      label: area.label,
      description: area.description,
      image: area.image,
      propertyLocationSlugs: area.propertyLocationSlugs,
      forRentCount: countForAreaSlugs(area.propertyLocationSlugs),
    }))

    return {
      categories,
      locations,
      totalForRent: rentalProperties.length,
    }
  })
}

/** Cached catalogue, or `undefined`. Read during render by the hook. */
export function readRentCatalogue(): RentCatalogue | undefined {
  return readCache<RentCatalogue>(CATALOGUE_QUERY_KEY)
}

/** Warms the catalogue so the page paints on its first frame. */
export function preloadRentCatalogue(): Promise<RentCatalogue> {
  return getRentCatalogue()
}

/* -------------------------------------------------------------------------- */
/* Featured rentals                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The exact query the featured grid renders — shared with the preloader.
 *
 * Rentals in the demo catalogue are not individually flagged as featured, so
 * the "featured" grid is simply the newest available rentals rather than a
 * hand-picked set. The contract is the filter below: change it here and the
 * preloader and the grid stay in lockstep.
 */
export const FEATURED_RENT_FILTERS: PropertyFilters = {
  ...defaultFilters,
  purpose: 'rent',
}

/**
 * The featured grid lives on the shared properties repository, not a
 * Rent-owned cache: it renders the same `PropertyCard` the listing page
 * renders, so it reuses that feature's query vocabulary end to end.
 */
export function getFeaturedRentProperties(limit: number): Promise<PropertyListingPage> {
  return fetchProperties({ filters: FEATURED_RENT_FILTERS, sort: 'newest', page: 1, perPage: limit })
}

/** Cached featured page (seeded during render) or `undefined`. */
export function readFeaturedRentProperties(limit: number): PropertyListingPage | undefined {
  return readProperties({
    filters: FEATURED_RENT_FILTERS,
    sort: 'newest',
    page: 1,
    perPage: limit,
  })
}

/** Warms the repository so the featured grid paints on the first frame. */
export function preloadFeaturedRentProperties(limit: number): Promise<PropertyListingPage> {
  return preloadProperties({
    filters: FEATURED_RENT_FILTERS,
    sort: 'newest',
    page: 1,
    perPage: limit,
  })
}
