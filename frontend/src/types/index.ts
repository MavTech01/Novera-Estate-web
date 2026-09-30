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
  | 'bed'
  | 'bath'
  | 'heart'
  | 'search'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'clock'
  | 'menu'
  | 'close'
  | 'star'

/** Social platforms rendered with the dedicated brand icon set. */
export type SocialPlatform = 'facebook' | 'instagram' | 'linkedin' | 'x'

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
  images: ImageAsset[]
  agent: Agent
  isFeatured: boolean
  yearBuilt: number | null
  /** Registered title / survey reference. */
  titleReference: string | null
  /** ISO date — will come straight from the API later. */
  listedAt: string
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
