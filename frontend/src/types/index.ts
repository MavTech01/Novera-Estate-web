/**
 * Domain models for the Novera Estates platform.
 *
 * These types mirror the shape the Express API will eventually return, so the
 * mock data in `src/data` can be swapped for API calls without touching any UI.
 */

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

/** Names of the icons available through the shared `<Icon />` registry. */
export type IconName =
  | 'badge-check'
  | 'file-text'
  | 'users'
  | 'calendar-search'
  | 'building-2'
  | 'building'
  | 'house'
  | 'land-plot'
  | 'store'
  | 'sparkles'
  | 'map-pin'
  | 'phone'
  | 'mail'
  | 'compass'
  | 'shield-check'
  | 'key'
  | 'ruler'
  | 'trending-up'
  | 'quote'
  | 'check'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-left'
  | 'bed'
  | 'bath'
  | 'heart'
  | 'search'
  | 'sliders-horizontal'
  | 'rotate-ccw'
  | 'triangle-alert'
  | 'car'
  | 'waves'
  | 'anchor'
  | 'leaf'
  | 'zap'
  | 'plug-zap'
  | 'dumbbell'
  | 'move-vertical'
  | 'sofa'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'menu'
  | 'close'
  | 'star'
  | 'share'
  | 'expand'
  | 'copy'
  | 'message'
  | 'calendar'
  | 'map'
  | 'navigation'
  | 'send'
  | 'check-circle'
  | 'chef-hat'
  | 'tv'
  | 'droplets'
  | 'trees'
  | 'wifi'
  | 'graduation-cap'
  | 'heart-pulse'
  | 'shopping-bag'
  | 'bus'
  | 'train'

/** Social platforms rendered with the dedicated brand icon set. */
export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'x'

/** Brand marks that have no equivalent in the generic icon registry. */
export type BrandIconName = SocialPlatform | 'whatsapp'

/* -------------------------------------------------------------------------- */
/* Shared sub-models                                                          */
/* -------------------------------------------------------------------------- */

export interface ImageAsset {
  src: string
  alt: string
}

export interface GeoLocation {
  id: string
  slug: string
  name: string
  city: string
  state: string
  /** Short human summary, e.g. "Lekki Phase 1, Lagos". */
  label: string
}

export interface Agent {
  id: string
  name: string
  role: string
  phone: string
  email: string
  avatar: ImageAsset
}

/* -------------------------------------------------------------------------- */
/* Property                                                                   */
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

/* -------------------------------------------------------------------------- */
/* Property detail                                                             */
/* -------------------------------------------------------------------------- */

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
/* Listing page                                                                */
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

/* -------------------------------------------------------------------------- */
/* Marketing content                                                          */
/* -------------------------------------------------------------------------- */

export interface PropertyCategory {
  id: string
  slug: string
  name: string
  description: string
  image: ImageAsset
  href: string
}

export interface LocationSummary extends GeoLocation {
  description: string
  image: ImageAsset
  availableProperties: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  location: string
  quote: string
  avatar: ImageAsset
  rating: number
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  /** ISO date. */
  publishedAt: string
  readTimeMinutes: number
  image: ImageAsset
  author: string
}

export interface Stat {
  id: string
  value: number
  suffix: string
  label: string
  description: string
}

export interface ServiceHighlight {
  id: string
  icon: IconName
  title: string
  description: string
}

/** Card model behind the services carousel. */
export interface Service {
  id: string
  slug: string
  title: string
  description: string
  icon: IconName
  image: ImageAsset
  href: string
  /** Short supporting line, e.g. "Sales & exchanges". */
  caption: string
}

export interface ProcessStep {
  id: string
  /** Short marker rendered in the node, e.g. "01". */
  step: string
  title: string
  description: string
  icon: IconName
}

export interface Development {
  id: string
  slug: string
  name: string
  location: GeoLocation
  startingPrice: number
  availableUnits: number
  propertyType: string
  description: string
  status: PropertyStatus
  completionDate: string
  developer: string
  highlights: string[]
  images: ImageAsset[]
}

export interface CompanyProfile {
  name: string
  descriptor: string
  tagline: string
  description: string
  phone: string
  phoneHref: string
  email: string
  emailHref: string
  address: {
    line1: string
    line2: string
    city: string
    state: string
  }
  hours: string
  socials: { id: SocialPlatform; label: string; href: string }[]
}

export interface NavigationLink {
  label: string
  href: string
  /** Distinguishes the primary nav from utility/footer links. */
  variant?: 'default' | 'accent'
}

export interface NavigationGroup {
  id: string
  title: string
  links: NavigationLink[]
}
