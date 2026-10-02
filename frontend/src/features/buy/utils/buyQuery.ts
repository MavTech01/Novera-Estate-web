import {
  ANY_FILTER,
  buildListingPropertiesHref,
  buildListingSearchHref,
  emptyListingSearch,
  findListingSearchProblem,
  hasListingSearch,
  parseListingSearch,
  serialiseListingSearch,
  toListingPropertyFilters,
} from '@/shared/lib/propertySearchQuery'
import type { PropertyFilters, PropertyType } from '@/types'
import type { BuyLocation, BuySearchCriteria } from '@/features/buy/types/buy.types'

/**
 * The Buy page's query layer.
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
 * What actually happens is shared. The Rent page asks the same five questions of
 * the same dialect and differs only in purpose and in what it calls money, so the
 * query mechanics live in `propertySearchQuery` and this module is the Buy
 * binding of them. These wrappers are Buy's public API: the panel imports
 * `ANY_FILTER` from here and the barrel re-exports the rest, so the names stay
 * put even though the implementation is no longer Buy's alone.
 *
 * The only translation that happens is the area slug: a visitor picks "Lekki",
 * while the catalogue stores six separate rows for it. Expanding that one slug
 * into the `location` values the properties facet already accepts is what makes
 * "all of Lekki" a single selection instead of six checkboxes.
 */

/** The "no selection" value shared by every `<select>` in the panel. */
export { ANY_FILTER }

/**
 * The unfiltered state — also the target of "Reset search".
 *
 * The same object the Rent panel resets to, since an unfiltered search is the
 * same whatever it is for. Treated as read-only; the reset path hands it back
 * rather than writing into it.
 */
export const emptyBuySearch: BuySearchCriteria = emptyListingSearch

/* -------------------------------------------------------------------------- */
/* URL <-> state                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Rebuilds the panel state from a query string.
 *
 * `areas` is required because an area is only identifiable by its own slug *and*
 * by the catalogue slugs behind it. Passing an empty list is safe — it just means
 * no area can be recognised yet, and the panel falls back to "any".
 */
export function parseBuySearch(
  query: URLSearchParams,
  areas: readonly BuyLocation[],
): BuySearchCriteria {
  return parseListingSearch(query, areas)
}

/* -------------------------------------------------------------------------- */
/* State -> URL                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Translates the panel's criteria into the listing page's own filter shape.
 *
 * This is the Buy binding of the shared translation, which returns a partial
 * filter set rather than a whole one: the panel owns five fields, while
 * `PropertyFilters` also carries sort, pagination, statuses and features that
 * belong to the listing page alone.
 */
export function toPropertyFilters(
  criteria: BuySearchCriteria,
  areas: readonly BuyLocation[],
): Partial<PropertyFilters> {
  return toListingPropertyFilters(criteria, areas, 'buy')
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
  return buildListingPropertiesHref(filters, 'buy')
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
  return serialiseListingSearch(criteria, areas)
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
  return buildListingSearchHref(criteria, areas, 'buy')
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
  return findListingSearchProblem(criteria, 'price')
}

/** True when any field differs from the unfiltered state. */
export function hasBuySearch(criteria: BuySearchCriteria): boolean {
  return hasListingSearch(criteria)
}
