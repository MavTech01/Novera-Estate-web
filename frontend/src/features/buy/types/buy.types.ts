import type { IconName, ImageAsset, PropertyType } from '@/types'

/**
 * Domain models for the Buy feature.
 *
 * The page is an *organised entry point* into the property catalogue, not a
 * second source of inventory, so nothing here redefines a listing. `Property`
 * stays the shared model: the same records, cards and filters the rest of the
 * site uses, requested with `purpose=buy`.
 *
 * What this file adds is only what the Buy page needs on top of that:
 *
 *   GET /api/properties?purpose=buy          → `Property[]` (featured)
 *   GET /api/properties?purpose=buy          → category and per-area counts
 *   GET /api/locations                       → the areas those counts describe
 *
 * Those aggregates are derived rather than stored today. Once PostgreSQL is
 * connected the counts become `COUNT(*)` group-by queries the endpoint computes,
 * and the components above this file are unchanged — they already receive plain
 * numbers rather than counting anything themselves.
 */

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * State behind the Buy page search panel.
 *
 * Every field is a string because each one is a `<select>` value *and* a query
 * parameter — the same shape travels to the browser, back out of it, and on to
 * `/properties` without a conversion step at any point in between.
 *
 * `any` is the "no selection" value, and deliberately not an empty string: an
 * empty `?type=` is ambiguous with "unset", while `any` is explicit, survives a
 * round-trip through the URL and reads clearly in a shared link.
 */
export interface BuySearchCriteria {
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
 * One buying category, as returned by the Buy page's category query.
 *
 * Deliberately built on the platform's own `PropertyType` vocabulary rather than
 * a second, Buy-specific taxonomy: a card that could not be expressed as a
 * catalogue filter would need its own page, and its counts would be describing
 * something the visitor cannot actually search for.
 */
export interface BuyCategory {
  id: string
  name: string
  description: string
  image: ImageAsset
  /** The catalogue filter this card opens. */
  propertyType: PropertyType
  /**
   * Sample listings available for sale under this category.
   *
   * *Derived* by the service from the sale catalogue, so the number on the card
   * and the number of results behind the link can never disagree. Demo-only
   * until the API computes it as a real aggregate.
   */
  count: number
}

/**
 * An area promoted in "Popular Buying Locations".
 *
 * `propertyLocationSlugs` is the Locations feature's mapping from an area to the
 * catalogue rows that make it up — Lekki alone spans six — and it is what lets a
 * single area card link to *every* listing in that area rather than one phase of
 * it. The mapping belongs to the Locations feature; this only reads it.
 */
export interface BuyLocation {
  id: string
  slug: string
  name: string
  label: string
  description: string
  image: ImageAsset
  /** The properties-catalogue slugs that make up this area. */
  propertyLocationSlugs: string[]
  /** Sample listings currently available for sale in this area. */
  forSaleCount: number
}

/**
 * Everything the Buy page's browsing sections need from one request.
 *
 * Categories and areas are returned together because both are counts over the
 * same sale catalogue: asking for them separately would mean two round trips
 * for one number each, and two loading states for sections that always agree.
 */
export interface BuyCatalogue {
  categories: BuyCategory[]
  locations: BuyLocation[]
  /** Total sample listings available for sale. */
  totalForSale: number
}

/* -------------------------------------------------------------------------- */
/* Editorial sections                                                          */
/* -------------------------------------------------------------------------- */

/** One step in "Buying Property Made Simpler". */
export interface BuyingProcessStep {
  id: string
  /** Short marker rendered as the step number, e.g. "01". */
  step: string
  title: string
  description: string
  icon: IconName
}

/**
 * One consideration in "What To Consider Before Buying".
 *
 * Informational only. These describe what a buyer should weigh up themselves —
 * they are not Novera Estates offering legal or financial advice, and the section
 * says so directly beneath the cards.
 */
export interface BuyerGuidanceCard {
  id: string
  title: string
  description: string
  icon: IconName
}

/** One question in the buying FAQ. */
export interface BuyFaqItem {
  id: string
  question: string
  answer: string
}

/* -------------------------------------------------------------------------- */
/* Requests                                                                    */
/* -------------------------------------------------------------------------- */

/** Shared request-status vocabulary, matching the other features' hooks. */
export type BuyRequestStatus = 'loading' | 'success' | 'error'

/**
 * A Buy page request in each of its three states.
 *
 * `value` is retained across a refresh — as everywhere else in the app — so a
 * reload dims the existing cards instead of collapsing them back to skeletons.
 */
export interface BuyResource<T> {
  status: BuyRequestStatus
  value: T
  /** True while `value` belongs to an earlier request. */
  isStale: boolean
  error: string | null
  isLoading: boolean
  /** Re-runs the request. */
  retry: () => void
}

/** The state behind the Buy page search panel. */
export interface BuySearchController {
  criteria: BuySearchCriteria
  /** True when at least one field differs from the unfiltered state. */
  isFiltered: boolean
  /** False when the panel holds a minimum above its maximum. */
  isValid: boolean
  /** Message shown when `isValid` is false. */
  validationMessage: string | null
  update: <K extends keyof BuySearchCriteria>(key: K, value: BuySearchCriteria[K]) => void
  /** Sends the visitor to the listing page with these filters applied. */
  submit: () => void
  reset: () => void
}
