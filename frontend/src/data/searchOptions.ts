import type { PropertyPurpose, PropertyType } from '../types'

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
]

/** Budget bands change depending on whether the visitor is buying or renting. */
export const priceBands: Record<PropertyPurpose, PriceBand[]> = {
  buy: [
    { value: 'any', label: 'Any price' },
    { value: 'under-50m', label: 'Under ₦50M', max: 50_000_000 },
    { value: '50m-150m', label: '₦50M – ₦150M', min: 50_000_000, max: 150_000_000 },
    { value: '150m-400m', label: '₦150M – ₦400M', min: 150_000_000, max: 400_000_000 },
    { value: 'over-400m', label: '₦400M and above', min: 400_000_000 },
  ],
  rent: [
    { value: 'any', label: 'Any price' },
    { value: 'under-5m', label: 'Under ₦5M / year', max: 5_000_000 },
    { value: '5m-10m', label: '₦5M – ₦10M / year', min: 5_000_000, max: 10_000_000 },
    { value: 'over-10m', label: '₦10M+ / year', min: 10_000_000 },
  ],
}

export function getPriceBands(purpose: PropertyPurpose): PriceBand[] {
  return priceBands[purpose]
}

export function findPriceBand(purpose: PropertyPurpose, value: string): PriceBand | undefined {
  return priceBands[purpose].find((band) => band.value === value)
}
