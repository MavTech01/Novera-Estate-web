import { listingStatusLabels, propertyTagIcons, propertyTagLabels, propertySortLabels } from '../lib/labels'
import type { IconName, ListingStatusFilter, PropertySort, PropertyTag, PropertyType } from '../types'
import type { SelectOption } from './searchOptions'

/**
 * Option lists that drive the listing-page filter UI.
 *
 * These live in the data layer (not in components) so the same values can back
 * a `<select>`, a checkbox group or a URL query string without duplication —
 * and so the API can return the facet list itself later.
 */

/** Listings per page. Deliberately divisible by the 1/2/3 column grid. */
export const PROPERTIES_PER_PAGE = 6

export const propertyTypeFilterOptions: SelectOption<PropertyType>[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'development', label: 'New Development' },
]

export interface ListingStatusOption extends SelectOption<ListingStatusFilter> {
  /** Accessible hint read out with the option label. */
  description: string
}

export const listingStatusOptions: ListingStatusOption[] = [
  { value: 'for-sale', label: listingStatusLabels['for-sale'], description: 'Available to purchase' },
  { value: 'for-rent', label: listingStatusLabels['for-rent'], description: 'Available to rent' },
  { value: 'new-listing', label: listingStatusLabels['new-listing'], description: 'Added in the last 30 days' },
  { value: 'featured', label: listingStatusLabels.featured, description: 'Promoted by Novera Estates' },
]

export interface FeatureOption extends SelectOption<PropertyTag> {
  icon: IconName
}

/** Feature facet, rendered with icons in both the sidebar and the mobile drawer. */
export const propertyFeatureOptions: FeatureOption[] = (
  Object.keys(propertyTagLabels) as PropertyTag[]
).map((tag) => ({
  value: tag,
  label: propertyTagLabels[tag],
  icon: propertyTagIcons[tag],
}))

/** Bedroom counts offered as "minimum bedrooms". `null` means any. */
export const bedroomOptions: number[] = [1, 2, 3, 4, 5]

/** Bathroom counts offered as "minimum bathrooms". `null` means any. */
export const bathroomOptions: number[] = [1, 2, 3, 4]

export const propertySortOptions: SelectOption<PropertySort>[] = (
  Object.keys(propertySortLabels) as PropertySort[]
).map((value) => ({ value, label: propertySortLabels[value] }))
