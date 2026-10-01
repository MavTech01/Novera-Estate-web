import {
  defaultFilters,
  filterParams,
  propertyTypes,
  serialiseQuery,
} from '@/shared/lib/propertyQuery'
import { routes } from '@/shared/lib/routes'
import type { PropertyFilters, PropertyType } from '@/types'
import type { BuyLocation, BuySearchCriteria } from '@/features/buy/types/buy.types'

/**
 * The Buy page query layer.
 *
 * Everything the Buy page's search panel does with the URL lives here, and the
 * central claim of this module is that **it speaks the listing page's own
 * dialect**. The catalogue models a purchase as `purpose=buy` rather than
 * `listingType=sale`, so the panel serialises to `purpose`, `type`, `location`,
 * `minPrice`, `maxPrice` and `bedrooms` — the exact parameters `parseFilters`
 * reads. Nothing about the platform's vocabulary is invented or duplicated for
 * this page, which is what lets the same values work today against the mock and
 * tomorrow against `GET /api/properties`.
 *
 * The only translation that happens is the area slug: a visitor picks "Lekki",
 * while the catalogue stores six separate rows for it. Expanding that one slug
 * into the `location` values the properties facet already accepts is what makes
 * "all of Lekki" a single selection instead of six checkboxes.
 */

/** The "no selection" value shared by every `<select>` in the panel. */
export const ANY_FILTER = 'any'

/** The unfiltered state — also the target of "Reset search". */
export const emptyBuySearch: BuySearchCriteria = {
  location: ANY_FILTER,
  propertyType: ANY_FILTER,
  minPrice: ANY_FILTER,
  maxPrice: ANY_FILTER,
  bedrooms: ANY_FILTER,
}

/* -------------------------------------------------------------------------- */
/* URL <-> state                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Reads a positive amount from a query parameter.
 *
 * Guards against a hand-edited or stale bookmark: a negative price or a
 * non-numeric value is dropped rather than passed on to the catalogue, where it
 * would silently return nothing.
 */
function readAmount(value: string | null): string {
  if (!value || value === ANY_FILTER) return ANY_FILTER

  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= 0 ? String(parsed) : ANY_FILTER
}

/** Reads a minimum bedroom count, keeping only values the catalogue can match. */
function readBedrooms(value: string | null): string {
  if (!value || value === ANY_FILTER) return ANY_FILTER

  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? String(parsed) : ANY_FILTER
}

function readPropertyType(value: string | null): PropertyType | typeof ANY_FILTER {
  return propertyTypes.includes(value as PropertyType) ? (value as PropertyType) : ANY_FILTER
}

/**
 * Rebuilds the panel state from a query string.
 *
 * Unknown values are dropped rather than thrown, so a hand-edited or stale
 * bookmark can never break the page.
 *
 * `areas` is required because an area is only identifiable by its own slug *and*
 * by the catalogue slugs behind it. Both are accepted: `?location=lekki` is what
 * this page writes and what a visitor would type, while a link pasted from
 * `/properties?location=gupe` also selects Lekki, because Gupe is one of Lekki's
 * six catalogue rows. Passing an empty list is safe — it just means no area can
 * be recognised yet, and the panel falls back to "any".
 */
export function parseBuySearch(
  query: URLSearchParams,
  areas: readonly BuyLocation[],
): BuySearchCriteria {
  const requested = query.getAll(filterParams.location).filter(Boolean)
  const area = areas.find(
    (candidate) =>
      candidate.slug === requested[0] ||
      candidate.propertyLocationSlugs.some((slug) => requested.includes(slug)),
  )

  return {
    location: area?.slug ?? ANY_FILTER,
    propertyType: readPropertyType(query.get(filterParams.type)),
    minPrice: readAmount(query.get(filterParams.minPrice)),
    maxPrice: readAmount(query.get(filterParams.maxPrice)),
    bedrooms: readBedrooms(query.get(filterParams.bedrooms)),
  }
}

/* -------------------------------------------------------------------------- */
/* State -> URL                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Translates the panel's criteria into the listing page's own filter shape.
 *
 * Returns a partial filter set rather than a whole one: the panel owns six
 * fields, while `PropertyFilters` also carries sort, pagination, statuses and
 * features that belong to the listing page alone. Filling in the defaults here
 * and overriding would be the same work with more to get wrong.
 */
export function toPropertyFilters(
  criteria: BuySearchCriteria,
  areas: readonly BuyLocation[],
): Partial<PropertyFilters> {
  const area = areas.find((candidate) => candidate.slug === criteria.location)

  return {
    purpose: 'buy',
    location: area ? [...area.propertyLocationSlugs] : [],
    propertyType: criteria.propertyType === ANY_FILTER ? [] : [criteria.propertyType],
    minPrice: criteria.minPrice === ANY_FILTER ? null : Number(criteria.minPrice),
    maxPrice: criteria.maxPrice === ANY_FILTER ? null : Number(criteria.maxPrice),
    bedrooms: criteria.bedrooms === ANY_FILTER ? null : Number(criteria.bedrooms),
  }
}

/**
 * The `/properties` URL for an explicit set of catalogue filters.
 *
 * The single exit point for every link on this page that opens the listing page
 * — the search panel, the category cards and the location cards — so the whole
 * page produces one consistent dialect.
 *
 * Built on `serialiseQuery`, which means defaults are omitted and shared links
 * stay short. `purpose=buy` is then stated explicitly: it is the listing page's
 * own default, so `serialiseQuery` drops it, but these URLs are meant to be
 * shared and bookmarked, "buy" is the one thing every link here has in common,
 * and stating it keeps them working if that default ever changes.
 */
export function buildBuyPropertiesHref(filters: Partial<PropertyFilters>): string {
  const params = serialiseQuery({ ...defaultFilters, ...filters, purpose: 'buy' })

  params.set(filterParams.purpose, 'buy')

  return `${routes.properties}?${params.toString()}`
}

/**
 * The Buy page's own address bar for a set of panel criteria.
 *
 * Carries the **area slug** the visitor picked (`location=lekki`) rather than the
 * six catalogue slugs behind it. That is deliberate: this URL belongs to the
 * panel, so it has to survive a round trip through `parseBuySearch`, and only
 * the area slug identifies an area here. Expansion to catalogue slugs happens
 * once, at the point of submitting to `/properties`.
 *
 * Used to keep the address bar in step with the panel, so a search is shareable
 * before it is ever submitted. `purpose=buy` is left to `buildBuyPropertiesHref`
 * — spelling out the page's own purpose in its own URL would be noise.
 */
export function serialiseBuySearch(
  criteria: BuySearchCriteria,
  areas: readonly BuyLocation[],
): URLSearchParams {
  const params = new URLSearchParams()
  const area = areas.find((candidate) => candidate.slug === criteria.location)

  if (area) params.set(filterParams.location, area.slug)
  if (criteria.propertyType !== ANY_FILTER) params.set(filterParams.type, criteria.propertyType)
  if (criteria.minPrice !== ANY_FILTER) params.set(filterParams.minPrice, criteria.minPrice)
  if (criteria.maxPrice !== ANY_FILTER) params.set(filterParams.maxPrice, criteria.maxPrice)
  if (criteria.bedrooms !== ANY_FILTER) params.set(filterParams.bedrooms, criteria.bedrooms)

  return params
}

/**
 * The `/properties` URL for a set of panel criteria.
 *
 * Every submission from the search panel goes through here — including "Reset
 * search", which submits nothing rather than returning to `/buy` — so a cleared
 * search lands on the full sale catalogue instead of the panel it was sent from.
 */
export function buildBuySearchHref(
  criteria: BuySearchCriteria,
  areas: readonly BuyLocation[],
): string {
  return buildBuyPropertiesHref(toPropertyFilters(criteria, areas))
}

/** The `/properties` URL for one property type. */
export function buildBuyCategoryHref(propertyType: PropertyType): string {
  return buildBuyPropertiesHref({ propertyType: [propertyType] })
}

/** The `/properties` URL for one area and every catalogue row behind it. */
export function buildBuyLocationHref(area: Pick<BuyLocation, 'propertyLocationSlugs'>): string {
  return buildBuyPropertiesHref({ location: [...area.propertyLocationSlugs] })
}

/* -------------------------------------------------------------------------- */
/* Validation & derived state                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Whether a minimum above a maximum was entered.
 *
 * Returning the two together would show an empty listing page with no
 * explanation, so the panel catches it before submitting and says what is wrong
 * in the field rather than in an error banner.
 */
export function findBuySearchProblem(criteria: BuySearchCriteria): string | null {
  const { minPrice, maxPrice } = criteria

  if (minPrice === ANY_FILTER || maxPrice === ANY_FILTER) return null

  const min = Number(minPrice)
  const max = Number(maxPrice)

  if (!Number.isFinite(min) || !Number.isFinite(max)) return null

  return min <= max
    ? null
    : 'Your minimum price is higher than your maximum. Swap them, or choose a wider range.'
}

/** True when any field differs from the unfiltered state. */
export function hasBuySearch(criteria: BuySearchCriteria): boolean {
  return (
    criteria.location !== ANY_FILTER ||
    criteria.propertyType !== ANY_FILTER ||
    criteria.minPrice !== ANY_FILTER ||
    criteria.maxPrice !== ANY_FILTER ||
    criteria.bedrooms !== ANY_FILTER
  )
}
