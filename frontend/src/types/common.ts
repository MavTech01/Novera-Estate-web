import type { SocialPlatform } from './icons'

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

export interface Stat {
  id: string
  value: number
  suffix: string
  label: string
  description: string
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
