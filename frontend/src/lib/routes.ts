import { findPriceBand } from '../data/searchOptions'
import type { PropertyPurpose, PropertySearchCriteria } from '../types'

/**
 * Route table.
 *
 * Path patterns live here (and only here) so `App.tsx` can resolve the current
 * URL and components can build hrefs without hard-coding paths. Later, when
 * React Router is introduced, these become the `createBrowserRouter` routes.
 */
export const routes = {
  home: '/',
  properties: '/properties',
  propertyDetail: '/properties/:slug',
  projects: '/projects',
  services: '/services/:slug',
  contact: '/contact',
} as const

/** Patterns tried in order when resolving the active route. */
export const routePatterns: readonly string[] = [
  routes.home,
  routes.properties,
  routes.propertyDetail,
  routes.projects,
]

/**
 * Translates the homepage hero form into the exact query string `/properties`
 * understands, so the same form can navigate instead of filtering in place.
 *
 * The hero control stores a budget *band*, while the listing page stores raw
 * bounds, so the band is resolved here rather than by the parser.
 */
export function propertySearchPath(criteria: PropertySearchCriteria): string {
  const params = new URLSearchParams()
  params.set('purpose', criteria.purpose)
  if (criteria.location.trim()) params.set('location', criteria.location.trim())
  if (criteria.propertyType !== 'any') params.set('type', criteria.propertyType)

  const band = findPriceBand(criteria.purpose, criteria.price) ?? findPriceBand(criteria.purpose, 'any')
  if (band?.min) params.set('minPrice', String(band.min))
  if (band?.max) params.set('maxPrice', String(band.max))

  return `${routes.properties}?${params.toString()}`
}

export function propertyPath(slug: string): string {
  return `/properties/${slug}`
}

export function locationPath(slug: string): string {
  return `/properties?location=${slug}`
}

/** Purpose deep-links used by the primary navigation. */
export function purposePath(purpose: PropertyPurpose): string {
  return `${routes.properties}?purpose=${purpose}`
}
