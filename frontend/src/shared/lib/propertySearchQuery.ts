import {
  defaultFilters,
  filterParams,
  propertyTypes,
  serialiseQuery,
} from '@/shared/lib/propertyQuery'
import { routes } from '@/shared/lib/routes'
import type { PropertyFilters, PropertyPurpose, PropertyType } from '@/types'

/**
 * The listing-search query layer shared by the Buy and Rent search panels.
 *
 * Both pages ask the same question with the same five fields — which area, which
 * property type, what budget, how many bedrooms — and both answer it in the
 * listing page's own dialect: `location`, `type`, `minPrice`, `maxPrice` and
 * `bedrooms`, the exact parameters `parseFilters` reads. That dialect is already
 * owned by `propertyQuery`, so this module sits beside it rather than inside
 * either feature: Buy and Rent both depend on it, which is precisely why it
 * cannot live inside Buy, and a search that targets `/properties` is not really
 * either feature's private business.
 *
 * The two pages genuinely differ in two places only — the listing `purpose` they
 * target, and the word they use for money ("price" versus "rent") — so those are
 * arguments rather than copies. Everything else, including the sentence that
 * reports a minimum above a maximum, is written once here.
 *
 * Two design points are load-bearing rather than cosmetic:
 *
 * - **The panel URL carries the area slug, not the catalogue slugs.** A visitor
 *   picks "Lekki" while the catalogue stores six rows for it. Carrying the slug
 *   keeps this URL round-trippable through `parseListingSearch`; expansion to
 *   catalogue slugs happens once, when submitting to `/properties`.
 * - **An empty `areas` list is safe, and means "not yet".** An area is only
 *   identifiable by its own slug *and* the catalogue slugs behind it, so with no
 *   catalogue no area can be recognised and every field falls back to "any". That
 *   is why the hooks hold off writing until the areas arrive: reading a shared
 *   link before then and writing the result back would destroy it.
 */

/** The "no selection" value shared by every `<select>` in the panels. */
export const ANY_FILTER = 'any'

/* -------------------------------------------------------------------------- */
/* Shape of what the panels hold                                               */
/* -------------------------------------------------------------------------- */

/**
 * The least an area has to expose to be selectable in a listing search.
 *
 * Structural rather than a shared named type, because Buy and Rent keep their own
 * domain types — `BuyLocation` and `RentLocation` differ in fields this query
 * layer never reads — and are not being merged.
 */
export interface ListingSearchArea {
  slug: string
  /** The properties-catalogue slugs that make up this area. */
  propertyLocationSlugs: readonly string[]
}

/**
 * One panel's criteria.
 *
 * Amounts and bedroom counts are strings because they come straight out of
 * `URLSearchParams`, and `ANY_FILTER` is the "no selection" marker rather than an
 * empty string, so a genuine zero is distinguishable from an unset field.
 */
export interface ListingSearchCriteria {
  /** Area slug, e.g. `lekki`. Expanded to catalogue slugs when building the link. */
  location: string
  propertyType: PropertyType | typeof ANY_FILTER
  /** Lower bound as a string, or `ANY_FILTER` for none. */
  minPrice: string
  /** Upper bound as a string, or `ANY_FILTER` for none. */
  maxPrice: string
  /** Minimum bedrooms as a string, or `ANY_FILTER` for none. */
  bedrooms: string
}

/** The unfiltered state — also the target of "Reset search". */
export const emptyListingSearch: ListingSearchCriteria = {
  location: ANY_FILTER,
  propertyType: ANY_FILTER,
  minPrice: ANY_FILTER,
  maxPrice: ANY_FILTER,
  bedrooms: ANY_FILTER,
}

/* -------------------------------------------------------------------------- */
/* URL -> state                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Reads a non-negative amount from a query parameter.
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
 * Finds the area a query is asking for.
 *
 * Both entry points are accepted: `?location=lekki` is what these panels write and
 * what a visitor would type, while a link pasted from `/properties?location=gupe`
 * also selects Lekki, because Gupe is one of Lekki's catalogue rows.
 */
function findRequestedArea(
  requested: readonly string[],
  areas: readonly ListingSearchArea[],
): ListingSearchArea | undefined {
  return areas.find(
    (candidate) =>
      candidate.slug === requested[0] ||
      candidate.propertyLocationSlugs.some((slug) => requested.includes(slug)),
  )
}

/**
 * Rebuilds a panel's criteria from a query string.
 *
 * Unknown values are dropped rather than thrown, so a hand-edited or stale
 * bookmark can never break the page.
 *
 * An empty `areas` list is the normal state before the catalogue loads, not an
 * error: no area can be recognised yet, so the area falls back to "any" while the
 * fields that need no catalogue — price, bedrooms, type — are still read.
 */
export function parseListingSearch(
  query: URLSearchParams,
  areas: readonly ListingSearchArea[],
): ListingSearchCriteria {
  const requested = query.getAll(filterParams.location).filter(Boolean)
  const area = findRequestedArea(requested, areas)

  return {
    location: area?.slug ?? ANY_FILTER,
    propertyType: readPropertyType(query.get(filterParams.type)),
    minPrice: readAmount(query.get(filterParams.minPrice)),
    maxPrice: readAmount(query.get(filterParams.maxPrice)),
    bedrooms: readBedrooms(query.get(filterParams.bedrooms)),
  }
}

/* -------------------------------------------------------------------------- */
/* State -> URL                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The panel's own address bar for a set of criteria.
 *
 * Defaults are omitted, so a shared link carries only what the visitor actually
 * chose. The listing `purpose` is deliberately not repeated here: this URL belongs
 * to the panel and says nothing about `/properties`, which states its own purpose.
 */
export function serialiseListingSearch(
  criteria: ListingSearchCriteria,
  areas: readonly ListingSearchArea[],
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

/** True when any field differs from the unfiltered state. */
export function hasListingSearch(criteria: ListingSearchCriteria): boolean {
  return (
    criteria.location !== ANY_FILTER ||
    criteria.propertyType !== ANY_FILTER ||
    criteria.minPrice !== ANY_FILTER ||
    criteria.maxPrice !== ANY_FILTER ||
    criteria.bedrooms !== ANY_FILTER
  )
}

/* -------------------------------------------------------------------------- */
/* Criteria -> the listing page                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Translates a panel's criteria into the listing page's own filter shape.
 *
 * Returns a partial filter set rather than a whole one: the panel owns five
 * fields, while `PropertyFilters` also carries sort, pagination, statuses and
 * features that belong to the listing page alone. Filling in the defaults here
 * and overriding would be the same work with more to get wrong.
 */
export function toListingPropertyFilters(
  criteria: ListingSearchCriteria,
  areas: readonly ListingSearchArea[],
  purpose: PropertyPurpose,
): Partial<PropertyFilters> {
  const area = areas.find((candidate) => candidate.slug === criteria.location)

  return {
    purpose,
    location: area ? [...area.propertyLocationSlugs] : [],
    propertyType: criteria.propertyType === ANY_FILTER ? [] : [criteria.propertyType],
    minPrice: criteria.minPrice === ANY_FILTER ? null : Number(criteria.minPrice),
    maxPrice: criteria.maxPrice === ANY_FILTER ? null : Number(criteria.maxPrice),
    bedrooms: criteria.bedrooms === ANY_FILTER ? null : Number(criteria.bedrooms),
  }
}

/**
 * The `/properties` URL for an explicit set of catalogue filters at one purpose.
 *
 * The single exit point for every link that opens the listing page, so each page
 * produces one consistent dialect.
 *
 * Built on `serialiseQuery`, which means defaults are omitted and shared links
 * stay short. The purpose is then stated explicitly even though it is the listing
 * page's own default: these URLs are meant to be shared and bookmarked, the
 * purpose is the one thing every link from these pages has in common, and stating
 * it keeps them working if that default ever changes.
 */
export function buildListingPropertiesHref(
  filters: Partial<PropertyFilters>,
  purpose: PropertyPurpose,
): string {
  const params = serialiseQuery({ ...defaultFilters, ...filters, purpose })

  params.set(filterParams.purpose, purpose)

  return `${routes.properties}?${params.toString()}`
}

/**
 * The `/properties` URL for a set of panel criteria.
 *
 * Every submission from a search panel goes through here — including "Reset
 * search", which submits nothing rather than returning to the panel it was sent
 * from — so a cleared search lands on the full catalogue for that purpose instead
 * of the panel it was sent from.
 */
export function buildListingSearchHref(
  criteria: ListingSearchCriteria,
  areas: readonly ListingSearchArea[],
  purpose: PropertyPurpose,
): string {
  return buildListingPropertiesHref(toListingPropertyFilters(criteria, areas, purpose), purpose)
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Whether a minimum above a maximum was entered.
 *
 * Returning the two together would show an empty listing page with no
 * explanation, so the panel catches it before submitting and says what is wrong in
 * the field rather than in an error banner.
 *
 * `priceNoun` is how this page names money — "price" when buying, "rent" when
 * renting — so the message reads in the visitor's own terms.
 */
export function findListingSearchProblem(
  criteria: ListingSearchCriteria,
  priceNoun: string,
): string | null {
  const { minPrice, maxPrice } = criteria

  if (minPrice === ANY_FILTER || maxPrice === ANY_FILTER) return null

  const min = Number(minPrice)
  const max = Number(maxPrice)

  if (!Number.isFinite(min) || !Number.isFinite(max)) return null

  return min <= max
    ? null
    : `Your minimum ${priceNoun} is higher than your maximum. Swap them, or choose a wider range.`
}
