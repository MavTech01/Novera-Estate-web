import { useCallback, useMemo, useState } from 'react'

import { searchProperties } from '../data'
import { findPriceBand } from '../data/searchOptions'
import type { Property, PropertyPurpose, PropertySearchCriteria, PropertySearchUpdater } from '../types'

const initialCriteria: PropertySearchCriteria = {
  purpose: 'buy',
  location: '',
  propertyType: 'any',
  price: 'any',
}

/**
 * Holds the hero search state and resolves matching listings.
 *
 * The homepage has no results page yet, so results are filtered in place.
 * Once `/properties` and the API exist, `submit` simply navigates and this hook
 * becomes the source of the URL query string.
 */
export function usePropertySearch() {
  const [criteria, setCriteria] = useState<PropertySearchCriteria>(initialCriteria)
  const [submittedCriteria, setSubmittedCriteria] = useState<PropertySearchCriteria | null>(null)

  const updateCriteria = useCallback<PropertySearchUpdater>((key, value) => {
    setCriteria((current) => {
      // Switching between buy and rent invalidates the selected budget band.
      if (key === 'purpose') {
        const purpose = value as PropertyPurpose
        return {
          ...current,
          purpose,
          price: findPriceBand(purpose, current.price) ? current.price : 'any',
        }
      }

      return { ...current, [key]: value } as PropertySearchCriteria
    })
  }, [])

  const results = useMemo<Property[]>(() => {
    if (!submittedCriteria) return []

    const band = findPriceBand(submittedCriteria.purpose, submittedCriteria.price)

    return searchProperties({
      purpose: submittedCriteria.purpose,
      propertyType: submittedCriteria.propertyType,
      location: submittedCriteria.location,
      priceMin: band?.min,
      priceMax: band?.max,
    })
  }, [submittedCriteria])

  const submit = useCallback(() => setSubmittedCriteria(criteria), [criteria])

  const reset = useCallback(() => {
    setCriteria(initialCriteria)
    setSubmittedCriteria(null)
  }, [])

  return {
    criteria,
    updateCriteria,
    submit,
    reset,
    results,
    isSearching: submittedCriteria !== null,
  }
}
