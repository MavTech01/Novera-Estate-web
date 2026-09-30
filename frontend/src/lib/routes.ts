import type { PropertySearchCriteria } from '../types'

/**
 * URL helpers.
 * The homepage search form works client-side today; these builders let the same
 * form degrade gracefully to a real `/properties` query string once routing and
 * the API exist.
 */
export function propertySearchPath(criteria: PropertySearchCriteria): string {
  const params = new URLSearchParams()
  params.set('purpose', criteria.purpose)
  if (criteria.location.trim()) params.set('location', criteria.location.trim())
  if (criteria.propertyType !== 'any') params.set('type', criteria.propertyType)

  const price = criteria.price.trim()
  if (price && price !== 'any') params.set('budget', price)

  return `/properties?${params.toString()}`
}

export function propertyPath(slug: string): string {
  return `/properties/${slug}`
}

export function locationPath(slug: string): string {
  return `/properties?location=${slug}`
}
