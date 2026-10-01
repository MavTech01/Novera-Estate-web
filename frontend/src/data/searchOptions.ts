import type { PropertyPurpose, PropertyType } from '@/types'

/** Options backing the hero property-search form. */
export interface SelectOption<T extends string = string> {
  value: T
  label: string
}

export interface PriceBand extends SelectOption {
  min?: number
  max?: number
}

export const purposeOptions: SelectOption<PropertyPurpose>[] = [
  { value: 'buy', label: 'Buy' },
  { value: 'rent', label: 'Rent' },
]

export const propertyTypeOptions: SelectOption<PropertyType | 'any'>[] = [
  { value: 'any', label: 'Any type' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'development', label: 'New Development' },
]

/** Budget bands change depending on whether the visitor is buying or renting. */
export const priceBands: Record<PropertyPurpose, PriceBand[]> = {
  buy: [
    { value: 'any', label: 'Any price' },
    { value: 'under-25m', label: 'Under ₦25M', max: 25_000_000 },
    { value: '25m-50m', label: '₦25M – ₦50M', min: 25_000_000, max: 50_000_000 },
    { value: '50m-150m', label: '₦50M – ₦150M', min: 50_000_000, max: 150_000_000 },
    { value: '150m-400m', label: '₦150M – ₦400M', min: 150_000_000, max: 400_000_000 },
    { value: 'over-400m', label: '₦400M and above', min: 400_000_000 },
  ],
  rent: [
    { value: 'any', label: 'Any price' },
    { value: 'under-2m', label: 'Under ₦2M / year', max: 2_000_000 },
    { value: '2m-6m', label: '₦2M – ₦6M / year', min: 2_000_000, max: 6_000_000 },
    { value: '6m-12m', label: '₦6M – ₦12M / year', min: 6_000_000, max: 12_000_000 },
    { value: 'over-12m', label: '₦12M+ / year', min: 12_000_000 },
  ],
}

export function getPriceBands(purpose: PropertyPurpose): PriceBand[] {
  return priceBands[purpose]
}

export function findPriceBand(purpose: PropertyPurpose, value: string): PriceBand | undefined {
  return priceBands[purpose].find((band) => band.value === value)
}

/**
 * Resolves explicit bounds back to a known band.
 * Used when the URL carries `minPrice`/`maxPrice` directly instead of a band key.
 */
export function findPriceBandByBounds(
  purpose: PropertyPurpose,
  min: number | null,
  max: number | null,
): PriceBand | undefined {
  if (min === null && max === null) return priceBands[purpose][0]

  return priceBands[purpose].find((band) => band.value !== 'any' && band.min === min && band.max === max)
}

/** Compact label for an ad-hoc price range, e.g. "₦20M – ₦35M". */
export function describePriceRange(min: number | null, max: number | null): string {
  const short = (value: number) =>
    value >= 1_000_000 ? `₦${Math.round(value / 1_000_000)}M` : `₦${Math.round(value / 1_000)}K`

  if (min !== null && max !== null) return `${short(min)} – ${short(max)}`
  if (max !== null) return `Up to ${short(max)}`
  if (min !== null) return `${short(min)} and above`

  return 'Any price'
}
