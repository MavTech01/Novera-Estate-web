import type { IconName, ImageAsset, PropertyType } from '@/types'

/**
 * Domain models for the Rent feature.
 *
 * The page is an *organised entry point* into the property catalogue, not a
 * second source of inventory, so nothing here redefines a listing. `Property`
 * stays the shared model; the Rent page simply requests it with `purpose=rent`.
 *
 * What this file adds is only what the Rent page needs on top of that:
 *
 *   GET /api/properties?purpose=rent   → featured rentals
 *   GET /api/properties?purpose=rent   → category and per-area counts
 *   GET /api/locations                 → the areas those counts describe
 *
 * Those aggregates are derived rather than stored today. Once PostgreSQL is
 * connected the counts become `COUNT(*)` group-by queries the endpoint computes,
 * and the components above this file are unchanged.
 */

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * State behind the Rent page search panel.
 *
 * Every field is a string because each one is a `<select>` value *and* a query
 * parameter — the same shape travels to the browser, back out of it, and on to
 * `/properties` without a conversion step in between.
 *
 * `any` is the "no selection" value: an empty `?type=` is ambiguous with
 * "unset", while `any` is explicit and survives a round-trip through the URL.
 */
export interface RentSearchCriteria {
  /** Area slug, e.g. `lekki`. Expanded to catalogue slugs when building the link. */
  location: string
  propertyType: PropertyType | 'any'
  /** Naira amount as a string, or `any` for no lower bound. */
  minPrice: string
  /** Naira amount as a string, or `any` for no upper bound. */
  maxPrice: string
  /** Minimum bedrooms as a string, or `any` for no minimum. */
  bedrooms: string
}

/* -------------------------------------------------------------------------- */
/* Catalogue aggregates                                                        */
/* -------------------------------------------------------------------------- */

/**
 * One rental category, as returned by the Rent page's category query.
 *
 * Built on the platform's own `PropertyType` vocabulary rather than a second,
 * Rent-specific taxonomy: a card that could not be expressed as a catalogue
 * filter would need its own page, and its count would describe something the
 * visitor cannot actually search for.
 */
export interface RentCategory {
  id: string
  name: string
  description: string
  image: ImageAsset
  /** The catalogue filter this card opens. */
  propertyType: PropertyType
  /**
   * Sample listings available to rent under this category.
   *
   * *Derived* by the service from the rental catalogue, so the number on the
   * card and the number of results behind the link can never disagree.
   */
  count: number
}

/**
 * An area promoted in "Explore Rentals by Location".
 *
 * `propertyLocationSlugs` is the Locations feature's mapping from an area to
 * the catalogue rows that make it up — Lekki alone spans six — and it is what
 * lets a single area card link to *every* rental in that area rather than one
 * phase of it. The mapping belongs to the Locations feature; this only reads it.
 */
export interface RentLocation {
  id: string
  slug: string
  name: string
  label: string
  description: string
  image: ImageAsset
  /** The properties-catalogue slugs that make up this area. */
  propertyLocationSlugs: string[]
  /** Sample rental listings currently available in this area. */
  forRentCount: number
}

/**
 * Everything the Rent page's browsing sections need from one request.
 *
 * Categories and areas are returned together because both are counts over the
 * same rental catalogue: asking for them separately would mean two round trips
 * for one number each, and two loading states for sections that always agree.
 */
export interface RentCatalogue {
  categories: RentCategory[]
  locations: RentLocation[]
  /** Total sample listings available to rent. */
  totalForRent: number
}

/* -------------------------------------------------------------------------- */
/* Editorial sections                                                          */
/* -------------------------------------------------------------------------- */

/** One step in "Renting Made Simpler". */
export interface RentalProcessStep {
  id: string
  /** Short marker rendered as the step number, e.g. "01". */
  step: string
  title: string
  description: string
  icon: IconName
}

/**
 * One consideration in "Things To Consider Before Renting".
 *
 * Informational only. These describe what a renter should weigh up themselves —
 * they are not Novera Estates offering legal or financial advice, and the
 * section says so directly beneath the cards.
 */
export interface RentalGuidanceCard {
  id: string
  title: string
  description: string
  icon: IconName
}

/** One question in the renting FAQ. */
export interface RentFaqItem {
  id: string
  question: string
  answer: string
}

/* -------------------------------------------------------------------------- */
/* Requests                                                                    */
/* -------------------------------------------------------------------------- */

/** Shared request-status vocabulary, matching the other features' hooks. */
export type RentRequestStatus = 'loading' | 'success' | 'error'

/**
 * A Rent page request in each of its three states.
 *
 * `value` is retained across a refresh — as everywhere else in the app — so a
 * reload dims the existing cards instead of collapsing them back to skeletons.
 */
export interface RentResource<T> {
  status: RentRequestStatus
  value: T
  /** True while `value` belongs to an earlier request. */
  isStale: boolean
  error: string | null
  isLoading: boolean
  /** Re-runs the request. */
  retry: () => void
}

/** The state behind the Rent page search panel. */
export interface RentSearchController {
  criteria: RentSearchCriteria
  /** True when at least one field differs from the unfiltered state. */
  isFiltered: boolean
  /** False when the panel holds a minimum above its maximum. */
  isValid: boolean
  /** Message shown when `isValid` is false. */
  validationMessage: string | null
  update: <K extends keyof RentSearchCriteria>(key: K, value: RentSearchCriteria[K]) => void
  /** Sends the visitor to the listing page with these filters applied. */
  submit: () => void
  reset: () => void
}
