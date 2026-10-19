import type { GeoLocation, ImageAsset } from './common'
import type { IconName } from './icons'
import type { PropertyStatus } from './properties'

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
