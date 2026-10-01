import type { IconName, ImageAsset } from '@/types'

/**
 * Domain models for the Locations feature.
 *
 * These types mirror the shape `GET /api/locations` and
 * `GET /api/locations/:slug` will return, so the demo records in `../data` can
 * be swapped for API calls without a single component, hook or filter helper
 * changing. Once the PERN backend lands, the `locations` table maps onto
 * `Location` and `location_images` / `location_landmarks` onto its collections.
 *
 * One deliberate departure from the other features: a location here is an *area*
 * (Lekki, Ajah, Ikoyi) rather than a single catalogue row. The properties
 * catalogue splits an area across several slugs, so `propertyLocationSlugs`
 * carries that mapping and the link out of the page is built from it.
 */

/* -------------------------------------------------------------------------- */
/* Enumerations                                                               */
/* -------------------------------------------------------------------------- */

/**
 * How an area is characterised on the page.
 *
 * Deliberately many-to-many and descriptive rather than exclusive: Lekki is an
 * island, a residential area and a luxury area all at once, and forcing it into
 * a single bucket would misdescribe it. In PostgreSQL this becomes a join table
 * (`location_categories`), not a column.
 */
export type LocationCategoryId = 'mainland' | 'island' | 'residential' | 'commercial' | 'luxury'

/** The value used by the category facet when no category is applied. */
export type LocationCategoryValue = LocationCategoryId | 'all'

/* -------------------------------------------------------------------------- */
/* Location                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * One area, as returned by `GET /api/locations`.
 *
 * The record already carries everything the future `/locations/:slug` page
 * needs — gallery, landmarks, long copy, property types — even though the
 * listing page only surfaces a fraction of it. Adding those fields later would
 * mean a second fetch and a second type, so the full shape is modelled now.
 */
export interface Location {
  id: string
  /** URL slug — becomes the `/locations/:slug` route param. */
  slug: string
  name: string
  city: string
  state: string
  /** Short human summary, e.g. "Lekki, Lagos". */
  label: string
  /** Country line shown under the name, e.g. "Lagos, Nigeria". */
  regionLabel: string
  /** One line, used on cards and in search results. */
  description: string
  /** Full copy, for the detail page. */
  longDescription: string
  image: ImageAsset
  /** Detail-page imagery. The listing page uses only `image`. */
  gallery: ImageAsset[]
  /** Cards and the featured block. */
  highlights: LocationHighlight[]
  /**
   * Sample figure for the "N Properties" badge.
   *
   * Demo-only: it does not describe live inventory, which is why the page
   * carries a visible notice and `isDemo` is always `true`. Once the API is
   * live this becomes a real aggregate the endpoint computes.
   */
  propertyCount: number
  /**
   * Developments sitting in this area.
   *
   * *Derived*, not authored: the service fills it from the Projects feature's
   * catalogue, so the badge on a card and the "Developments by Location" list
   * underneath it can never disagree. The API will compute it the same way
   * (`GROUP BY location_slug`).
   */
  projectCount: number
  /** Extra search terms — neighbourhood spellings and what the area is known for. */
  keywords: string[]
  /** Property types commonly listed here, for the detail page. */
  popularPropertyTypes: string[]
  /** Grouped surroundings. Never presented as a measured distance. */
  nearbyLandmarks: LocationLandmark[]
  categories: LocationCategoryId[]
  /**
   * The properties-catalogue slugs that make up this area.
   *
   * Lekki is listed under `lekki-phase-1`, `lekki-phase-2`, `gupe`, `chevron`,
   * `sangotedo` and `osapa`, so the outbound link repeats `?location=` for each
   * one. The properties feature owns how those are filtered — this feature only
   * says which slugs belong together.
   */
  propertyLocationSlugs: string[]
  /**
   * Position on the static map visual, as a percentage of its box.
   *
   * Presentation metadata for the placeholder map. Deliberately approximate and
   * not published as coordinates, so nothing here can be mistaken for a
   * surveyed position of a development site.
   */
  mapPosition: LocationMapPosition
  isFeatured: boolean
  /** Demo-only flag: marks the record as sample data until the API is live. */
  isDemo: true
}

/**
 * The authored shape of a location record.
 *
 * Everything that follows mechanically from a location's identity — its region
 * label, search keywords, map position, nearby landmarks and the property-slug
 * mapping — is derived by `withLocationDetails` rather than typed six times over
 * in `../data/locations`, and `projectCount` is filled in by the service from
 * the Projects catalogue. A future `GET /api/locations` returns all of these
 * fields explicitly, so the seed type describes the *mock* record, not the domain
 * model. The `Location` interface above is the contract everything codes against.
 */
export type LocationSeed = Omit<
  Location,
  'regionLabel' | 'propertyLocationSlugs' | 'mapPosition' | 'nearbyLandmarks' | 'projectCount'
>

/** Percentage offsets within the static map box. */
export interface LocationMapPosition {
  x: number
  y: number
}

/** A talking point shown on the card and in the featured block. */
export interface LocationHighlight {
  id: string
  title: string
  description: string
  icon: IconName
}

/** Categories a landmark group belongs to, mirroring the projects feature. */
export type LocationLandmarkCategory =
  | 'shopping'
  | 'schools'
  | 'healthcare'
  | 'roads'
  | 'business'
  | 'recreation'
  | 'transportation'

/** One nearby place, grouped by category. Never presented as a measured fact. */
export interface LocationLandmark {
  id: string
  category: LocationLandmarkCategory
  label: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* Filtering                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The complete filter state behind `/locations`.
 *
 * Every value is a primitive, which is what makes the state trivially
 * serialisable to a query string — the same shape `GET /api/locations` accepts.
 */
export interface LocationFilters {
  /** Free-text match across name, city, state and keywords. */
  query: string
  /** A single category, or 'all'. */
  category: LocationCategoryValue
}

/** A single removable filter, rendered as a chip above the grid. */
export interface ActiveLocationFilter {
  id: string
  label: string
  field: keyof LocationFilters
}

/** Query parameters accepted by `getLocations()`. */
export type LocationListQuery = LocationFilters

/* -------------------------------------------------------------------------- */
/* Supporting records                                                         */
/* -------------------------------------------------------------------------- */

/** One tile in the category filter strip. */
export interface LocationCategoryOption {
  value: LocationCategoryValue
  label: string
  icon: IconName
  /** Plain-language explanation of what the category means. */
  description: string
}

/** One block in the "Why Location Matters" section. */
export interface LocationFactor {
  id: string
  title: string
  description: string
  icon: IconName
}

/**
 * One row of the "Explore Areas That Match Your Needs" comparison.
 *
 * The value is a short descriptive phrase, never a number: the section exists
 * to explain how areas differ, and a score would read as a ranking.
 */
export interface LocationComparisonAttribute {
  id: string
  label: string
  /** Short note explaining what a visitor should actually weigh up. */
  description: string
  icon: IconName
}

/** One cell of the comparison table. */
export type LocationComparisonDescriptor = 'strong' | 'moderate' | 'limited'

/** A location's summary line for one comparison attribute. */
export interface LocationComparisonCell {
  locationId: string
  attributeId: string
  descriptor: LocationComparisonDescriptor
  /** Optional per-cell nuance, e.g. "depends on the estate". */
  note?: string
}

/** A full comparison row: one attribute across every compared location. */
export interface LocationComparisonRow {
  attribute: LocationComparisonAttribute
  cells: LocationComparisonCell[]
}

/** The comparison table, ready to render. */
export interface LocationComparisonTable {
  locations: Location[]
  rows: LocationComparisonRow[]
}
