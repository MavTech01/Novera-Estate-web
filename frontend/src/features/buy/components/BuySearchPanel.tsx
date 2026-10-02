import { getPriceBands } from '@/data/searchOptions'
import { buyPropertyTypes } from '@/features/buy/data/buyData'
import { useBuySearch } from '@/features/buy/hooks/useBuySearch'
import type { BuyLocation } from '@/features/buy/types/buy.types'
import { ListingSearchPanel } from '@/shared/components/properties/ListingSearchPanel'

interface BuySearchPanelProps {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly BuyLocation[]
}

/**
 * The guided "for sale" search on the Buy page.
 *
 * This is a feature wrapper: it wires Buy-specific data, copy and the Buy search
 * hook to the shared `ListingSearchPanel` UI.
 */
export function BuySearchPanel({ areas }: BuySearchPanelProps) {
  const { criteria, validationMessage, isValid, update, submit, reset } = useBuySearch(areas)

  const priceBands = getPriceBands('buy')
  const propertyTypeOptions = [...buyPropertyTypes]

  return (
    <ListingSearchPanel
      idPrefix="buy"
      areas={areas}
      criteria={criteria}
      isValid={isValid}
      validationMessage={validationMessage}
      priceBands={priceBands}
      propertyTypeOptions={propertyTypeOptions}
      copy={{
        listingTypeLabel: 'Listing type',
        listingTypeValue: 'buy',
        listingTypeOptionText: 'For Sale',
        listingTypeNote: 'This page shows properties available for purchase.',
        locationLabel: 'Location',
        propertyTypeLabel: 'Property type',
        minPriceLabel: 'Minimum budget',
        maxPriceLabel: 'Maximum budget',
        anyAreaLabel: 'Any area',
        anyPropertyTypeLabel: 'Any property type',
        anyMinPriceLabel: 'Any budget',
        anyMaxPriceLabel: 'No upper limit',
        anyBedroomsLabel: 'Any bedrooms',
        submitLabel: 'Search Properties',
        resetLabel: 'Reset search',
        footerNote: 'Opens the full catalogue with your filters applied.',
      }}
      onUpdate={update}
      onSubmit={submit}
      onReset={reset}
    />
  )
}
