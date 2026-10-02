import { getPriceBands } from '@/data/searchOptions'
import { rentPropertyTypes } from '@/features/rent/data/rentData'
import { useRentSearch } from '@/features/rent/hooks/useRentSearch'
import type { RentLocation } from '@/features/rent/types/rent.types'
import { ListingSearchPanel } from '@/shared/components/properties/ListingSearchPanel'

interface RentSearchPanelProps {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly RentLocation[]
}

/**
 * The guided rental search on the Rent page.
 *
 * This is a feature wrapper: it wires Rent-specific data, copy and the Rent
 * search hook to the shared `ListingSearchPanel` UI.
 */
export function RentSearchPanel({ areas }: RentSearchPanelProps) {
  const { criteria, validationMessage, isValid, update, submit, reset } = useRentSearch(areas)

  const priceBands = getPriceBands('rent')
  const propertyTypeOptions = [...rentPropertyTypes]

  return (
    <ListingSearchPanel
      idPrefix="rent"
      areas={areas}
      criteria={criteria}
      isValid={isValid}
      validationMessage={validationMessage}
      priceBands={priceBands}
      propertyTypeOptions={propertyTypeOptions}
      copy={{
        listingTypeLabel: 'Listing type',
        listingTypeValue: 'rent',
        listingTypeOptionText: 'For Rent',
        listingTypeNote: 'This page shows properties available to rent.',
        locationLabel: 'Location',
        propertyTypeLabel: 'Property type',
        minPriceLabel: 'Minimum rent',
        maxPriceLabel: 'Maximum rent',
        anyAreaLabel: 'Any area',
        anyPropertyTypeLabel: 'Any property type',
        anyMinPriceLabel: 'Any rent',
        anyMaxPriceLabel: 'No upper limit',
        anyBedroomsLabel: 'Any bedrooms',
        submitLabel: 'Search Rentals',
        resetLabel: 'Reset search',
        footerNote: 'Opens the full catalogue with your filters applied. Rent is shown per year unless stated.',
      }}
      onUpdate={update}
      onSubmit={submit}
      onReset={reset}
    />
  )
}
