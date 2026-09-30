import { filterProperties, paginate, sortProperties, type Paginated } from '../lib/propertyQuery'
import type { Property, PropertyDetail, PropertyFilters, PropertySort } from '../types'
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
const MOCK_LATENCY_MS = 160

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

/** Returns a filtered, sorted and paginated slice of the demo catalogue. */
export async function fetchProperties({
  filters,
  sort = 'newest',
  page = 1,
  perPage = 6,
}: PropertyListingQuery): Promise<PropertyListingPage> {
  await delay(MOCK_LATENCY_MS)

  const matched = filterProperties(properties, filters)

  return paginate(sortProperties(matched, sort), page, perPage)
}

/**
 * Single listing for the detail page.
 *
 * Mirrors `GET /api/properties/:slug`: it resolves to a `null` payload for an
 * unknown slug (so the caller can render a not-found state rather than treating
 * it as a transport failure) and is the only function that assembles the
 * detail-only fields onto a catalogue entry.
 */
export async function fetchPropertyBySlug(slug: string): Promise<PropertyDetail | null> {
  await delay(MOCK_LATENCY_MS)

  const property = properties.find((item) => item.slug === slug)

  return property ? buildPropertyDetail(property) : null
}
