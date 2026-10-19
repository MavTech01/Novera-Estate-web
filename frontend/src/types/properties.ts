import type { Agent, GeoLocation, ImageAsset } from './common'
import type { IconName } from './icons'

/* -------------------------------------------------------------------------- */
/* Enumerations                                                               */
/* -------------------------------------------------------------------------- */

export type PropertyPurpose = 'buy' | 'rent'

export type PropertyType =
  | 'house'
  | 'apartment'
  | 'land'
  | 'commercial'
  | 'luxury'
  | 'development'

export type PropertyStatus =
  | 'for-sale'
  | 'for-rent'
  | 'new-listing'
  | 'off-market'

/**
 * Controlled vocabulary for the "Features" facet.
 *
 * Listings carry free-text `features`/`amenities` for the detail page, but
 * filtering needs stable values — this becomes a `property_tags` join table
 * once the API exists.
 */
export type PropertyTag =
  | 'parking'
  | 'swimming-pool'
  | 'security'
  | 'bq'
  | 'garden'
  | 'serviced'
  | 'generator'
  | 'power'
  | 'gym'
  | 'lift'
  | 'furnished'
  | 'waterfront'

/** Listing states offered as filter chips, including the featured flag. */
export type ListingStatusFilter = 'for-sale' | 'for-rent' | 'new-listing' | 'featured'

/** Sort options for the results grid. */
export type PropertySort = 'newest' | 'price-asc' | 'price-desc' | 'popular'

/* -------------------------------------------------------------------------- */
/* Property models                                                            */
/* -------------------------------------------------------------------------- */

export interface Property {
  id: string
  /** URL slug — will become the `/properties/:slug` route param. */
  slug: string
  /** Short internal reference, e.g. "NE-LK-1042". */
  reference: string
  title: string
  summary: string
  description: string
  /** Amount in naira. Null when the price is negotiable/on request. */
  price: number | null
  /** Present for rentals only, e.g. "year". */
  pricePeriod?: 'year' | 'month' | 'quarter'
  purpose: PropertyPurpose
  status: PropertyStatus
  propertyType: PropertyType
  location: GeoLocation
  /** Null for land and commercial plots. */
  bedrooms: number | null
  bathrooms: number | null
  parkingSpaces: number | null
  /** Build area in square metres. */
  area: number
  features: string[]
  amenities: string[]
  /** Normalised feature keys used by the listing-page filters. */
  tags: PropertyTag[]
  images: ImageAsset[]
  agent: Agent
  isFeatured: boolean
  /** Demo-only flag: documents the listing before it goes live. */
  isVerified: boolean
  /** Listing views — powers the "Most Popular" sort. */
  views: number
  yearBuilt: number | null
  /** Registered title / survey reference. */
  titleReference: string | null
  /** ISO date — will come straight from the API later. */
  listedAt: string
}

/** Availability state shown in the "Property details" table. */
export type PropertyAvailability = 'available' | 'reserved' | 'sold'

/** Geographic point used by the map placeholder. */
export interface Coordinates {
  lat: number
  lng: number
}

export type DocumentStatus = 'available' | 'pending' | 'unavailable'

/** One row of the optional "Property Documentation" section. */
export interface PropertyDocumentationEntry {
  id: string
  /** e.g. "Title", "Survey", "Deed of assignment". */
  label: string
  /** e.g. "Available" or the registered reference. */
  value: string
  status: DocumentStatus
}

/**
 * Documentation summary for a listing.
 *
 * Every entry in the demo catalogue is illustrative, so the UI renders an
 * explicit disclaimer rather than implying a completed legal review.
 */
export interface PropertyDocumentation {
  /** True while the listings are sample data and nothing has been verified. */
  isDemo: boolean
  note: string
  entries: PropertyDocumentationEntry[]
}

/** Groups the "Around the neighbourhood" list into a fixed set of buckets. */
export type SurroundingsCategory =
  | 'nearby-areas'
  | 'major-roads'
  | 'schools'
  | 'hospitals'
  | 'shopping'
  | 'transportation'

/** One bucket of nearby landmarks shown under the map. */
export interface PropertySurroundings {
  category: SurroundingsCategory
  label: string
  icon: IconName
  items: string[]
}

/**
 * Full listing as returned by `GET /api/properties/:slug`.
 *
 * Extends the card-level `Property` with the fields only the detail page needs.
 * Keeping them on a separate type means the listing grid never has to deal with
 * detail-only data, while the API can still return a single flat object.
 */
export interface PropertyDetail extends Property {
  /** Marketing sub-type, e.g. "Detached Duplex" (narrower than `propertyType`). */
  subType: string
  availability: PropertyAvailability
  livingRooms: number | null
  /** Staff quarters — count, or null when the property has none. */
  bq: number | null
  coordinates: Coordinates | null
  documentation: PropertyDocumentation | null
  surroundings: PropertySurroundings[]
  /** ISO date the record was created; distinct from `listedAt`. */
  createdAt: string
  /** Detail-page imagery — falls back to `images` when the listing has no extras. */
  gallery: ImageAsset[]
}

/**
 * Detail-only data layered on top of a catalogue entry.
 *
 * Stored separately from `properties.ts` so the shared catalogue stays small:
 * most listings need nothing beyond the fields on `Property`, and only the
 * richer demo listings carry an extras record.
 */
export interface PropertyDetailExtras {
  subType?: string
  availability?: PropertyAvailability
  livingRooms?: number | null
  bq?: number | null
  coordinates?: Coordinates
  description?: string
  summary?: string
  features?: string[]
  amenities?: string[]
  gallery?: ImageAsset[]
  documentation?: PropertyDocumentation
  createdAt?: string
}

/** A single "at a glance" figure in the property overview strip. */
export interface PropertyOverviewStat {
  id: string
  icon: IconName
  value: string
  label: string
}

/** A single label/value pair in the "Property details" table. */
export interface PropertySpecRow {
  id: string
  label: string
  value: string
}

/** Values collected by the inspection request form. */
export interface InspectionRequest {
  fullName: string
  phone: string
  email: string
  preferredDate: string
  preferredTime: string
  message: string
}

/** Payload sent to the future `POST /api/inspections` endpoint. */
export interface InspectionRequestPayload extends InspectionRequest {
  propertyId: string
  propertySlug: string
  propertyTitle: string
}

/** Payload accepted by the hero property-search form. */
export interface PropertySearchCriteria {
  purpose: PropertyPurpose
  location: string
  propertyType: PropertyType | 'any'
  price: string
}

/** Typed setter handed to the search form. */
export type PropertySearchUpdater = <K extends keyof PropertySearchCriteria>(
  key: K,
  value: PropertySearchCriteria[K],
) => void

/* -------------------------------------------------------------------------- */
/* Listing page filters                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The complete filter state behind `/properties`.
 *
 * Every value is a primitive or an array of primitives, which is what makes
 * the state trivially serialisable to a query string — the exact same shape
 * `GET /api/properties` will accept later.
 */
export interface PropertyFilters {
  purpose: PropertyPurpose | 'any'
  /** Free-text match across location, city and title. */
  query: string
  /** Selected location slugs. */
  location: string[]
  propertyType: PropertyType[]
  /** Lower bound in naira. */
  minPrice: number | null
  /** Upper bound in naira. */
  maxPrice: number | null
  /** Minimum number of bedrooms (properties without bedrooms never match). */
  bedrooms: number | null
  /** Minimum number of bathrooms. */
  bathrooms: number | null
  statuses: ListingStatusFilter[]
  tags: PropertyTag[]
}

/** A single removable filter, used to render the active-filter chips. */
export interface ActiveFilter {
  id: string
  label: string
  /** Which filter field this chip clears when removed. */
  field: keyof PropertyFilters
  /** Value to remove when the chip is dismissed (omit to clear the whole field). */
  value?: string | number
}

export interface PropertyCategory {
  id: string
  slug: string
  name: string
  description: string
  image: ImageAsset
  href: string
}
