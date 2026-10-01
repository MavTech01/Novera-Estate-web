import { formatArea, formatNumber } from './format'
import { propertyPurposeLabels, propertyTypeLabels } from './labels'
import type {
  Property,
  PropertyAvailability,
  PropertyDetail,
  PropertyOverviewStat,
  PropertySpecRow,
} from '@/types'

/**
 * Presentation helpers for the property detail page.
 *
 * Pure functions only — every one of them takes a `Property` (or a
 * `PropertyDetail`) and returns view data, so the components stay declarative
 * and the same helpers work unchanged against API responses.
 */

/* -------------------------------------------------------------------------- */
/* Availability                                                                */
/* -------------------------------------------------------------------------- */

const availabilityLabels: Record<PropertyAvailability, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
}

export function getAvailabilityLabel(availability: PropertyAvailability): string {
  return availabilityLabels[availability]
}

/* -------------------------------------------------------------------------- */
/* Overview strip                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The "at a glance" figures shown under the header.
 * Rows without a value (land plots have no bedrooms) are dropped, so the grid
 * never renders an empty cell.
 */
export function getOverviewStats(property: PropertyDetail): PropertyOverviewStat[] {
  const stats: PropertyOverviewStat[] = []

  if (property.bedrooms !== null) {
    stats.push({
      id: 'bedrooms',
      icon: 'bed',
      value: formatNumber(property.bedrooms),
      label: property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms',
    })
  }

  if (property.bathrooms !== null) {
    stats.push({
      id: 'bathrooms',
      icon: 'bath',
      value: formatNumber(property.bathrooms),
      label: property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms',
    })
  }

  stats.push({ id: 'area', icon: 'ruler', value: formatArea(property.area), label: 'Property Size' })

  if (property.parkingSpaces !== null) {
    stats.push({
      id: 'parking',
      icon: 'car',
      value: formatNumber(property.parkingSpaces),
      label: property.parkingSpaces === 1 ? 'Parking Space' : 'Parking Spaces',
    })
  }

  if (property.livingRooms !== null) {
    stats.push({
      id: 'living-rooms',
      icon: 'sofa',
      value: formatNumber(property.livingRooms),
      label: property.livingRooms === 1 ? 'Living Room' : 'Living Rooms',
    })
  }

  if (property.bq !== null) {
    stats.push({ id: 'bq', icon: 'users', value: formatNumber(property.bq), label: property.bq === 1 ? 'BQ' : 'BQs' })
  }

  return stats
}

/* -------------------------------------------------------------------------- */
/* Details table                                                               */
/* -------------------------------------------------------------------------- */

const NOT_RECORDED = 'Not recorded'

/** Documentation status of a single document type, or null when not tracked. */
export function getDocumentationValue(property: PropertyDetail, label: string): string | null {
  return property.documentation?.entries.find((entry) => entry.label === label)?.value ?? null
}

/**
 * The "Property details" table.
 * Ordered by what a buyer checks first: reference, type, price basis, then
 * physical attributes and paperwork.
 */
export function getSpecificationRows(property: PropertyDetail): PropertySpecRow[] {
  const rows: PropertySpecRow[] = [
    { id: 'reference', label: 'Property ID', value: property.reference },
    { id: 'sub-type', label: 'Property Type', value: property.subType },
    { id: 'listing-type', label: 'Listing Type', value: propertyPurposeLabels[property.purpose] },
    { id: 'status', label: 'Status', value: getAvailabilityLabel(property.availability) },
    { id: 'category', label: 'Category', value: propertyTypeLabels[property.propertyType] },
    { id: 'year-built', label: 'Year Built', value: property.yearBuilt ? String(property.yearBuilt) : NOT_RECORDED },
    { id: 'size', label: 'Property Size', value: formatArea(property.area) },
  ]

  if (property.bedrooms !== null) {
    rows.push({ id: 'bedrooms', label: 'Bedrooms', value: formatNumber(property.bedrooms) })
  }

  if (property.bathrooms !== null) {
    rows.push({ id: 'bathrooms', label: 'Bathrooms', value: formatNumber(property.bathrooms) })
  }

  if (property.parkingSpaces !== null) {
    rows.push({ id: 'parking', label: 'Parking', value: formatNumber(property.parkingSpaces) })
  }

  rows.push({
    id: 'documentation',
    label: 'Title / Documentation',
    value: getDocumentationValue(property, 'Title') ?? (property.titleReference ? 'Available' : NOT_RECORDED),
  })

  return rows
}

/* -------------------------------------------------------------------------- */
/* Description                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Splits a description into paragraphs.
 * A blank line separates paragraphs; single newlines are treated as soft wraps
 * so single-paragraph copy still renders as one block.
 */
export function toParagraphs(description: string): string[] {
  return description
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

/* -------------------------------------------------------------------------- */
/* Breadcrumb                                                                  */
/* -------------------------------------------------------------------------- */

export interface BreadcrumbItem {
  id: string
  label: string
  href?: string
  /**
   * Character budget for narrow screens. Trail entries that carry a long name
   * set this so the row stays on one line under the sticky navbar.
   */
  truncateAt?: number
}

/** Home → Properties → Location → Listing, matching the nav hierarchy. */
export function getBreadcrumbItems(property: Property): BreadcrumbItem[] {
  return [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'properties', label: 'Properties', href: '/properties' },
    {
      id: 'location',
      label: property.location.name,
      href: `/properties?location=${property.location.slug}`,
      truncateAt: 16,
    },
    { id: 'property', label: property.title, truncateAt: 24 },
  ]
}

/**
 * Keeps a long listing name inside a single breadcrumb row.
 * Both ends are preserved because they carry the most meaning; the middle is
 * elided only when the title genuinely overflows on a phone.
 */
export function truncateMiddle(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value

  const keepEnd = Math.ceil((maxLength - 1) / 2)
  const keepStart = Math.max(maxLength - 1 - keepEnd, 0)

  return `${value.slice(0, keepStart).trimEnd()}…${value.slice(value.length - keepEnd)}`
}

/* -------------------------------------------------------------------------- */
/* Similar properties                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Ranks a candidate against the listing being viewed.
 * Higher is a better match. Location outweighs type, which outweighs price, so
 * a cheaper home in the same street outranks an identical one across town.
 */
function scoreMatch(source: Property, candidate: Property): number {
  if (candidate.id === source.id) return -1

  let score = 0

  if (candidate.location.slug === source.location.slug) score += 4
  if (candidate.propertyType === source.propertyType) score += 3
  if (candidate.purpose === source.purpose) score += 2

  if (candidate.bedrooms !== null && source.bedrooms !== null) {
    const difference = Math.abs(candidate.bedrooms - source.bedrooms)
    score += difference === 0 ? 3 : difference === 1 ? 1 : 0
  }

  if (candidate.price !== null && source.price !== null) {
    const ratio = candidate.price / source.price
    if (ratio >= 0.7 && ratio <= 1.4) score += 2
    else if (ratio >= 0.5 && ratio <= 2) score += 1
  }

  // Popularity is only a tie-break between otherwise equally good matches.
  score += Math.min(candidate.views / 20_000, 1)

  return score
}

/**
 * Picks the closest listings in the catalogue.
 * Excludes the source listing, drops anything with a negative score and falls
 * back to the most recent listings if nothing scores well.
 */
export function findSimilarProperties(
  source: Property,
  catalogue: Property[],
  limit = 3,
): Property[] {
  const ranked = catalogue
    .map((candidate) => ({ candidate, score: scoreMatch(source, candidate) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.listedAt.localeCompare(a.candidate.listedAt))

  if (ranked.length >= limit) return ranked.slice(0, limit).map((entry) => entry.candidate)

  const chosen = ranked.map((entry) => entry.candidate)
  const filler = catalogue
    .filter((candidate) => candidate.id !== source.id && !chosen.some((item) => item.id === candidate.id))
    .sort((a, b) => b.listedAt.localeCompare(a.listedAt))
    .slice(0, limit - chosen.length)

  return [...chosen, ...filler]
}
