import { findPriceBandByBounds } from '@/data/searchOptions'
import { listingStatusLabels, propertyTagLabels, propertyTypeLabels } from './labels'
import type {
  ActiveFilter,
  ListingStatusFilter,
  Property,
  PropertyFilters,
  PropertyPurpose,
  PropertySort,
  PropertyTag,
  PropertyType,
} from '@/types'

/**
 * The listing query layer.
 *
 * Everything here is a pure function over plain data: no React, no JSX, no
 * direct access to the mock collection. That is deliberate — when the backend
 * arrives, `GET /api/properties` accepts exactly these parameters and returns
 * pre-filtered, pre-sorted rows, so these functions become a client-side cache
 * (or disappear entirely) without a single component change.
 */

/** Query-string keys. Centralised so parsing and serialising can never drift. */
export const filterParams = {
  purpose: 'purpose',
  query: 'q',
  location: 'location',
  type: 'type',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  bedrooms: 'bedrooms',
  bathrooms: 'bathrooms',
  status: 'status',
  feature: 'feature',
  sort: 'sort',
  page: 'page',
} as const

export const propertyTypes: PropertyType[] = [
  'house',
  'apartment',
  'land',
  'commercial',
  'luxury',
  'development',
]

export const listingStatuses: ListingStatusFilter[] = ['for-sale', 'for-rent', 'new-listing', 'featured']

export const propertyTags: PropertyTag[] = [
  'parking',
  'swimming-pool',
  'security',
  'bq',
  'garden',
  'serviced',
  'generator',
  'power',
  'gym',
  'lift',
  'furnished',
  'waterfront',
]

export const propertySorts: PropertySort[] = ['newest', 'price-asc', 'price-desc', 'popular']

/** The unfiltered state — also the target of "Reset filters". */
export const defaultFilters: PropertyFilters = {
  purpose: 'buy',
  query: '',
  location: [],
  propertyType: [],
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,
  statuses: [],
  tags: [],
}

export const defaultSort: PropertySort = 'newest'

/* -------------------------------------------------------------------------- */
/* URL <-> state                                                                */
/* -------------------------------------------------------------------------- */

function readPositiveInt(value: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function readNumber(value: string | null): number | null {
  if (!value) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
}

function readEnumList<T extends string>(query: URLSearchParams, key: string, allowed: readonly T[]): T[] {
  const allowedSet = new Set<string>(allowed)
  return query.getAll(key).filter((value): value is T => allowedSet.has(value))
}

/**
 * Rebuilds the filter state from a query string.
 * Unknown values are dropped rather than thrown, so a hand-edited or stale
 * bookmark can never break the page.
 */
export function parseFilters(query: URLSearchParams): PropertyFilters {
  const purpose = query.get(filterParams.purpose)

  return {
    purpose:
      purpose === 'buy' || purpose === 'rent'
        ? (purpose as PropertyPurpose)
        : defaultFilters.purpose,
    query: query.get(filterParams.query)?.trim() ?? '',
    location: query.getAll(filterParams.location).filter(Boolean),
    propertyType: readEnumList(query, filterParams.type, propertyTypes),
    minPrice: readNumber(query.get(filterParams.minPrice)),
    maxPrice: readNumber(query.get(filterParams.maxPrice)),
    bedrooms: readPositiveInt(query.get(filterParams.bedrooms)),
    bathrooms: readPositiveInt(query.get(filterParams.bathrooms)),
    statuses: readEnumList(query, filterParams.status, listingStatuses),
    tags: readEnumList(query, filterParams.feature, propertyTags),
  }
}

export function parseSort(query: URLSearchParams): PropertySort {
  const sort = query.get(filterParams.sort)
  return propertySorts.includes(sort as PropertySort) ? (sort as PropertySort) : defaultSort
}

export function parsePage(query: URLSearchParams): number {
  return readPositiveInt(query.get(filterParams.page)) ?? 1
}

/**
 * Serialises the full listing state to a query string.
 * Default values are omitted so shared links stay short and readable.
 */
export function serialiseQuery(
  filters: PropertyFilters,
  sort: PropertySort = defaultSort,
  page = 1,
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.purpose !== defaultFilters.purpose) params.set(filterParams.purpose, filters.purpose)
  if (filters.query) params.set(filterParams.query, filters.query)
  for (const location of filters.location) params.append(filterParams.location, location)
  for (const type of filters.propertyType) params.append(filterParams.type, type)
  if (filters.minPrice !== null) params.set(filterParams.minPrice, String(filters.minPrice))
  if (filters.maxPrice !== null) params.set(filterParams.maxPrice, String(filters.maxPrice))
  if (filters.bedrooms !== null) params.set(filterParams.bedrooms, String(filters.bedrooms))
  if (filters.bathrooms !== null) params.set(filterParams.bathrooms, String(filters.bathrooms))
  for (const status of filters.statuses) params.append(filterParams.status, status)
  for (const tag of filters.tags) params.append(filterParams.feature, tag)
  if (sort !== defaultSort) params.set(filterParams.sort, sort)
  if (page > 1) params.set(filterParams.page, String(page))

  return params
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                    */
/* -------------------------------------------------------------------------- */

/** How a listing relates to one of the four listing-status facet values. */
export function propertyMatchesStatus(property: Property, status: ListingStatusFilter): boolean {
  switch (status) {
    case 'for-sale':
      return property.purpose === 'buy' && property.status !== 'new-listing' && property.status !== 'off-market'
    case 'for-rent':
      return property.purpose === 'rent' && property.status !== 'new-listing' && property.status !== 'off-market'
    case 'new-listing':
      return property.status === 'new-listing'
    case 'featured':
      return property.isFeatured
  }
}

function propertyMatchesQuery(property: Property, query: string): boolean {
  if (!query) return true

  const haystack = [
    property.title,
    property.reference,
    property.location.label,
    property.location.name,
    property.location.city,
    property.location.state,
    propertyTypeLabels[property.propertyType],
  ]
    .join(' ')
    .toLowerCase()

  // Every whitespace-separated term must appear somewhere in the listing.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

export function propertyMatchesFilters(property: Property, filters: PropertyFilters): boolean {
  if (filters.purpose !== 'any' && property.purpose !== filters.purpose) return false
  if (!propertyMatchesQuery(property, filters.query)) return false
  if (filters.location.length > 0 && !filters.location.includes(property.location.slug)) return false
  if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.propertyType)) return false

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    // Listings without a published price cannot satisfy a price filter.
    if (property.price === null) return false
    if (filters.minPrice !== null && property.price < filters.minPrice) return false
    if (filters.maxPrice !== null && property.price > filters.maxPrice) return false
  }

  if (filters.bedrooms !== null) {
    if (property.bedrooms === null || property.bedrooms < filters.bedrooms) return false
  }

  if (filters.bathrooms !== null) {
    if (property.bathrooms === null || property.bathrooms < filters.bathrooms) return false
  }

  if (filters.statuses.length > 0) {
    if (!filters.statuses.some((status) => propertyMatchesStatus(property, status))) return false
  }

  if (filters.tags.length > 0) {
    if (!filters.tags.every((tag) => property.tags.includes(tag))) return false
  }

  return true
}

export function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter((property) => propertyMatchesFilters(property, filters))
}

/* -------------------------------------------------------------------------- */
/* Sorting                                                                      */
/* -------------------------------------------------------------------------- */

const priceOf = (property: Property) => property.price ?? Number.POSITIVE_INFINITY

export function sortProperties(properties: Property[], sort: PropertySort): Property[] {
  const sorted = [...properties]

  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => priceOf(a) - priceOf(b) || a.id.localeCompare(b.id))
      break
    case 'price-desc':
      sorted.sort((a, b) => priceOf(b) - priceOf(a) || a.id.localeCompare(b.id))
      break
    case 'popular':
      sorted.sort((a, b) => b.views - a.views || a.id.localeCompare(b.id))
      break
    case 'newest':
    default:
      sorted.sort((a, b) => b.listedAt.localeCompare(a.listedAt) || a.id.localeCompare(b.id))
      break
  }

  return sorted
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                   */
/* -------------------------------------------------------------------------- */

export interface Paginated<T> {
  items: T[]
  /** 1-based current page, always within range. */
  page: number
  pageCount: number
  total: number
  /** 1-based index of the first item on this page (0 when empty). */
  from: number
  to: number
  perPage: number
}

/**
 * Client-side pagination.
 *
 * The shape mirrors what `GET /api/properties?page=&limit=` will return, so the
 * `PropertyPagination` component can later be driven straight off the response
 * without changes.
 */
export function paginate<T>(items: T[], requestedPage: number, perPage: number): Paginated<T> {
  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const page = Math.min(Math.max(1, Math.floor(requestedPage)), pageCount)
  const start = (page - 1) * perPage
  const pageItems = items.slice(start, start + perPage)

  return {
    items: pageItems,
    page,
    pageCount,
    total,
    from: total === 0 ? 0 : start + 1,
    to: start + pageItems.length,
    perPage,
  }
}

/**
 * Page numbers to render, with `null` marking an elided range.
 * `['1', null, 4, 5, 6, null, '10']`
 */
export function buildPageWindow(current: number, pageCount: number, siblings = 1): (number | null)[] {
  if (pageCount <= 1) return [1]

  const pages = new Set<number>([1, pageCount])
  for (let offset = -siblings; offset <= siblings; offset += 1) {
    const page = current + offset
    if (page > 1 && page < pageCount) pages.add(page)
  }

  const ordered = [...pages].sort((a, b) => a - b)
  const window: (number | null)[] = []

  ordered.forEach((page, index) => {
    const previous = ordered[index - 1]
    if (previous !== undefined && page - previous > 1) window.push(null)
    window.push(page)
  })

  return window
}

/* -------------------------------------------------------------------------- */
/* Filter metadata                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Flattens the filter state into removable chips.
 * `resolveLocationLabel` is injected so this module stays free of data imports.
 */
export function describeActiveFilters(
  filters: PropertyFilters,
  resolveLocationLabel: (slug: string) => string,
): ActiveFilter[] {
  const chips: ActiveFilter[] = []

  if (filters.purpose !== defaultFilters.purpose) {
    chips.push({ id: 'purpose', label: filters.purpose === 'buy' ? 'Buying' : 'Renting', field: 'purpose' })
  }

  if (filters.query) {
    chips.push({ id: 'query', label: `"${filters.query}"`, field: 'query' })
  }

  for (const location of filters.location) {
    chips.push({
      id: `location:${location}`,
      label: resolveLocationLabel(location),
      field: 'location',
      value: location,
    })
  }

  for (const type of filters.propertyType) {
    chips.push({ id: `type:${type}`, label: propertyTypeLabels[type], field: 'propertyType', value: type })
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const purpose = filters.purpose === 'any' ? 'buy' : filters.purpose
    const band = findPriceBandByBounds(purpose, filters.minPrice, filters.maxPrice)

    chips.push({
      id: 'price',
      label: band?.label ?? `${filters.minPrice ?? 0} – ${filters.maxPrice ?? 'max'}`,
      field: 'minPrice',
    })
  }

  if (filters.bedrooms !== null) {
    chips.push({ id: 'bedrooms', label: `${filters.bedrooms}+ beds`, field: 'bedrooms' })
  }

  if (filters.bathrooms !== null) {
    chips.push({ id: 'bathrooms', label: `${filters.bathrooms}+ baths`, field: 'bathrooms' })
  }

  for (const status of filters.statuses) {
    chips.push({ id: `status:${status}`, label: listingStatusLabels[status], field: 'statuses', value: status })
  }

  for (const tag of filters.tags) {
    chips.push({ id: `feature:${tag}`, label: propertyTagLabels[tag], field: 'tags', value: tag })
  }

  return chips
}

/** Adds or removes a value from one of the array-based facets. */
export function toggleListValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}
