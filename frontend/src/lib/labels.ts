import type { IconName, PropertyStatus, PropertyType } from '../types'

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
  development: 'Development',
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
