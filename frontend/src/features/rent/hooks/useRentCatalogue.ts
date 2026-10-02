import { useCallback, useEffect, useState } from 'react'

import { readRentCatalogue, getRentCatalogue } from '@/features/rent/services/rentService'
import type { RentCatalogue, RentRequestStatus, RentResource } from '@/features/rent/types/rent.types'

export const EMPTY_RENT_CATALOGUE: RentCatalogue = {
  categories: [],
  locations: [],
  totalForRent: 0,
}

/**
 * Request hook for the Rent page catalogue.
 *
 * The Rent page is a lazy composition of two sources — the catalogue request
 * below, and the featured grid on the shared property repository. This hook
 * owns the former, and it follows the same lifecycle the Buy and Locations
 * hooks use:
 *
 *  - **Reads the service cache during render**, so a response `routeManifest`
 *    already preloaded is used immediately and the page mounts without a
 *    skeleton frame.
 *  - **Keeps the error retryable** — the transport failed, not the visitor.
 */
export function useRentCatalogue(): RentResource<RentCatalogue> {
  const [state, setState] = useState<{ value: RentCatalogue } | null>(() => {
    const cached = readRentCatalogue()
    return cached ? { value: cached } : null
  })
  const [failure, setFailure] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCancelled = false

    getRentCatalogue()
      .then((value) => {
        if (isCancelled) return
        setState({ value })
        setFailure(null)
      })
      .catch(() => {
        if (isCancelled) return
        setFailure("We couldn't load the rental catalogue right now. Please try again.")
      })

    return () => {
      isCancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setFailure(null)
    setAttempt((value) => value + 1)
  }, [])

  const status: RentRequestStatus = failure ? 'error' : state ? 'success' : 'loading'
  const value = state?.value ?? EMPTY_RENT_CATALOGUE

  return {
    status,
    value,
    isStale: false,
    error: failure,
    isLoading: status === 'loading',
    retry,
  }
}
