import type {
  IconName,
  ListingStatusFilter,
  PropertySort,
  PropertyStatus,
  PropertyType,
} from '@/types'

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

