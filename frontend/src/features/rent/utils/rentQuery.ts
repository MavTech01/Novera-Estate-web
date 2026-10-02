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
import type { RentLocation, RentSearchCriteria } from '@/features/rent/types/rent.types'

/**
 * The Rent page's query layer.
 *
 * Everything the Rent page's search panel does with the URL lives here, and the
 * central claim of this module is that **it speaks the listing page's own
 * dialect**. The catalogue models a rental as `purpose=rent` rather than a
 * separate listing type, so the panel serialises to `purpose`, `type`, `location`,
 * `minPrice`, `maxPrice` and `bedrooms` — the exact parameters `parseFilters`
 * reads. Nothing about the platform's vocabulary is invented or duplicated for
 * this page, which is what lets the same values work today against the mock and
 * tomorrow against `GET /api/properties?purpose=rent`.
 *
 * What actually happens is shared. The Buy page asks the same five questions of
 * the same dialect and differs only in purpose and in what it calls money, so the
 * query mechanics live in `propertySearchQuery` and this module is the Rent
 * binding of them. These wrappers are Rent's public API: the panel imports
 * `ANY_FILTER` from here and the barrel re-exports the rest, so the names stay
 * put even though the implementation is no longer Rent's alone.
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
 * The same object the Buy panel resets to, since an unfiltered search is the
 * same whatever it is for. Treated as read-only; the reset path hands it back
 * rather than writing into it.
 */
export const emptyRentSearch: RentSearchCriteria = emptyListingSearch

/* -------------------------------------------------------------------------- */
/* URL <-> state                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Rebuilds the panel state from a query string.
 *
 * `areas` is required because an area is identifiable by its own slug *and* by
 * the catalogue slugs behind it. Passing an empty list is safe — it just means no
 * area can be recognised yet, and the panel falls back to "any".
 */
export function parseRentSearch(
  query: URLSearchParams,
  areas: readonly RentLocation[],
): RentSearchCriteria {
  return parseListingSearch(query, areas)
}

/* -------------------------------------------------------------------------- */
/* State -> URL                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Translates the panel's criteria into the listing page's own filter shape.
 *
 * This is the Rent binding of the shared translation, which returns a partial
 * filter set rather than a whole one: the panel owns five fields, while
 * `PropertyFilters` also carries sort, pagination, statuses and features that
 * belong to the listing page alone.
 */
export function toPropertyFilters(
  criteria: RentSearchCriteria,
  areas: readonly RentLocation[],
): Partial<PropertyFilters> {
  return toListingPropertyFilters(criteria, areas, 'rent')
}

/**
 * The `/properties` URL for an explicit set of catalogue filters.
 *
 * The single exit point for every link on this page that opens the listing page
 * — the search panel, the category cards and the location cards — so the whole
 * page produces one consistent dialect.
 *
 * Built on `serialiseQuery`, which means defaults are omitted and shared links
 * stay short. `purpose=rent` is then stated explicitly: it is the one thing
 * every link here has in common, and stating it keeps them working if the
 * listing page's default ever changes.
 */
export function buildRentPropertiesHref(filters: Partial<PropertyFilters>): string {
  return buildListingPropertiesHref(filters, 'rent')
}

/**
 * The Rent page's own address bar for a set of panel criteria.
 *
 * Carries the **area slug** the visitor picked (`location=lekki`) rather than the
 * six catalogue slugs behind it. That is deliberate: this URL belongs to the
 * panel, so it has to survive a round trip through `parseRentSearch`, and only
 * the area slug identifies an area here. Expansion to catalogue slugs happens
 * once, at the point of submitting to `/properties`.
 */
export function serialiseRentSearch(
  criteria: RentSearchCriteria,
  areas: readonly RentLocation[],
): URLSearchParams {
  return serialiseListingSearch(criteria, areas)
}

/**
 * The `/properties` URL for a set of panel criteria.
 *
 * Every submission from the search panel goes through here — including "Reset
 * search", which submits nothing rather than returning to `/rent` — so a cleared
 * search lands on the full rental catalogue instead of the panel it was sent
 * from.
 */
export function buildRentSearchHref(
  criteria: RentSearchCriteria,
  areas: readonly RentLocation[],
): string {
  return buildListingSearchHref(criteria, areas, 'rent')
}

/** The `/properties` URL for one property type. */
export function buildRentCategoryHref(propertyType: PropertyType): string {
  return buildRentPropertiesHref({ propertyType: [propertyType] })
}

/** The `/properties` URL for one area and every catalogue row behind it. */
export function buildRentLocationHref(area: Pick<RentLocation, 'propertyLocationSlugs'>): string {
  return buildRentPropertiesHref({ location: [...area.propertyLocationSlugs] })
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
export function findRentSearchProblem(criteria: RentSearchCriteria): string | null {
  return findListingSearchProblem(criteria, 'rent')
}

/** True when any field differs from the unfiltered state. */
export function hasRentSearch(criteria: RentSearchCriteria): boolean {
  return hasListingSearch(criteria)
}
