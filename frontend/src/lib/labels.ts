import type {
  IconName,
  ListingStatusFilter,
  PropertyFilters,
  PropertySort,
  PropertyStatus,
  PropertyType,
} from '../types'

/** Human-readable labels for the property enumerations (API enum → UI copy). */
export const propertyStatusLabels: Record<PropertyStatus, string> = {
  'for-sale': 'For Sale',
  'for-rent': 'For Rent',
  'new-listing': 'New Listing',
  'off-market': 'Off Market',
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  house: 'House',
  apartment: 'Apartment',
  land: 'Land',
  commercial: 'Commercial',
  luxury: 'Luxury',
  development: 'New Development',
}

export const propertyTypeIcons: Record<PropertyType, IconName> = {
  house: 'house',
  apartment: 'building',
  land: 'land-plot',
  commercial: 'store',
  luxury: 'sparkles',
  development: 'building-2',
}

/** The next-step action for a listing, used on cards and detail pages. */
export const propertyPurposeLabels: Record<'buy' | 'rent', string> = {
  buy: 'Buy',
  rent: 'Rent',
}

/** Copy for the "Listing status" filter facet. */
export const listingStatusLabels: Record<ListingStatusFilter, string> = {
  'for-sale': 'For Sale',
  'for-rent': 'For Rent',
  'new-listing': 'New',
  featured: 'Featured',
}

/** Label for the compact status pill rendered on a listing card. */
export const listingBadgeLabels: Record<ListingStatusFilter, string> = {
  ...listingStatusLabels,
  featured: 'Featured',
}

/** Feature facet labels and their icons. */
export const propertyTagLabels: Record<string, string> = {
  parking: 'Parking',
  'swimming-pool': 'Swimming Pool',
  security: 'Security',
  bq: 'BQ',
  garden: 'Garden',
  serviced: 'Serviced',
  generator: 'Generator',
  power: '24/7 Electricity',
  gym: 'Gym',
  lift: 'Lift',
  furnished: 'Furnished',
  waterfront: 'Waterfront',
}

export const propertyTagIcons: Record<string, IconName> = {
  parking: 'car',
  'swimming-pool': 'waves',
  security: 'shield-check',
  bq: 'users',
  garden: 'leaf',
  serviced: 'sparkles',
  generator: 'zap',
  power: 'plug-zap',
  gym: 'dumbbell',
  lift: 'move-vertical',
  furnished: 'sofa',
  waterfront: 'anchor',
}

export const propertySortLabels: Record<PropertySort, string> = {
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  popular: 'Most Popular',
}

/** Human label for a single filter value, reused by chips and the summary line. */
export function describeFilterValue(field: keyof PropertyFilters, value: string | number): string {
  if (field === 'propertyType') return propertyTypeLabels[value as PropertyType] ?? String(value)
  if (field === 'statuses') return listingStatusLabels[value as ListingStatusFilter] ?? String(value)
  if (field === 'tags') return propertyTagLabels[String(value)] ?? String(value)
  if (field === 'purpose') return propertyPurposeLabels[value as 'buy' | 'rent'] ?? String(value)
  if (field === 'bedrooms' || field === 'bathrooms') return `${value}+`

  return String(value)
}
