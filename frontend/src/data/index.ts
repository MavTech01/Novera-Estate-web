/**
 * Data access layer.
 *
 * Every component reads content through the selectors below — never by
 * importing the raw collections directly. When the Express API and PostgreSQL
 * backend are introduced, only this file needs to change: each selector becomes
 * an `await api.get(...)` call and returns the same shapes.
 */

import { agents } from './agents'
import { articles } from './articles'
import { company, footerNavigation, footerServices, legalLinks, navigationCta, primaryNavigation } from './company'
import { featuredDevelopment } from './development'
import { featuredLocations, locations } from './locations'
import { processSteps } from './processSteps'
import { buildPropertyDetail } from './propertyDetails'
import { properties } from './properties'
import { propertyCategories } from './propertyCategories'
import { serviceHighlights } from './serviceHighlights'
import { services } from './services'
import { companyStats } from './stats'
import { testimonials } from './testimonials'
import { findSimilarProperties } from '../lib/propertyDetails'
import type {
  Article,
  Development,
  GeoLocation,
  Property,
  PropertyCategory,
  PropertyDetail,
  PropertyPurpose,
  PropertyType,
  Service,
} from '../types'

export {
  agents,
  articles,
  company,
  featuredDevelopment,
  featuredLocations,
  footerNavigation,
  footerServices,
  legalLinks,
  locations,
  navigationCta,
  primaryNavigation,
  processSteps,
  properties,
  propertyCategories,
  serviceHighlights,
  services,
  companyStats,
  testimonials,
}

/* ------------------------------ Properties ------------------------------ */

/** Properties flagged as featured, newest listing first. */
export function getFeaturedProperties(limit?: number): Property[] {
  const featured = properties
    .filter((property) => property.isFeatured)
    .sort((a, b) => b.listedAt.localeCompare(a.listedAt))

  return typeof limit === 'number' ? featured.slice(0, limit) : featured
}

export function getPropertyBySlug(slug: string): Property | undefined {
  return properties.find((property) => property.slug === slug)
}

/**
 * Detail-page variant of `getPropertyBySlug`, returning the merged
 * `PropertyDetail` record used by `/properties/:slug`.
 */
export function getPropertyDetailBySlug(slug: string): PropertyDetail | null {
  const property = getPropertyBySlug(slug)
  return property ? buildPropertyDetail(property) : null
}

/** Listings closest to the one being viewed, for the recommendation row. */
export function getSimilarProperties(property: Property, limit = 3): Property[] {
  return findSimilarProperties(property, properties, limit)
}

export function getPropertiesByPurpose(purpose: PropertyPurpose): Property[] {
  return properties.filter((property) => property.purpose === purpose)
}

export function getPropertiesByType(propertyType: PropertyType): Property[] {
  return properties.filter((property) => property.propertyType === propertyType)
}

export function getPropertiesByLocation(slug: string): Property[] {
  return properties.filter((property) => property.location.slug === slug)
}

/** Simple keyword search used by the hero search form. */
export function searchProperties(criteria: {
  purpose?: PropertyPurpose
  propertyType?: PropertyType | 'any'
  location?: string
  priceMin?: number
  priceMax?: number
}): Property[] {
  const locationQuery = criteria.location?.trim().toLowerCase()

  return properties.filter((property) => {
    if (criteria.purpose && property.purpose !== criteria.purpose) return false
    if (criteria.propertyType && criteria.propertyType !== 'any' && property.propertyType !== criteria.propertyType)
      return false
    if (criteria.priceMax && property.price && property.price > criteria.priceMax) return false
    if (criteria.priceMin && property.price && property.price < criteria.priceMin) return false
    if (locationQuery && !property.location.label.toLowerCase().includes(locationQuery)) return false
    return true
  })
}

/** Distinct locations that currently have listings — powers the search select. */
export function getSearchableLocations(): GeoLocation[] {
  const seen = new Map<string, GeoLocation>()

  for (const property of properties) {
    if (!seen.has(property.location.id)) seen.set(property.location.id, property.location)
  }

  return [...seen.values()]
}

/* ------------------------------ Content --------------------------------- */

export function getPropertyCategories(): PropertyCategory[] {
  return propertyCategories
}

export function getFeaturedLocations() {
  return featuredLocations
}

export function getTestimonials() {
  return testimonials
}

export function getArticles(limit?: number): Article[] {
  const sorted = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted
}

export function getFeaturedDevelopment(): Development {
  return featuredDevelopment
}

export function getStats() {
  return companyStats
}

export function getServiceHighlights() {
  return serviceHighlights
}

export function getServices(): Service[] {
  return services
}

export function getProcessSteps() {
  return processSteps
}

export function getNavigation() {
  return primaryNavigation
}
