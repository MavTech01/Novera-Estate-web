import { useCallback, useEffect, useState } from 'react'

import { readBuyCatalogue, getBuyCatalogue } from '@/features/buy/services/buyService'
import type { BuyCatalogue, BuyRequestStatus, BuyResource } from '@/features/buy/types/buy.types'

export const EMPTY_BUY_CATALOGUE: BuyCatalogue = {
  categories: [],
  locations: [],
  totalForSale: 0,
}

/**
 * Request hook for the Buy page catalogue.
 *
 * The Buy page is a lazy composition of two sources — the catalogue request
 * below, and the featured grid on the shared property repository. This hook
 * owns the former, and it follows the same lifecycle the About and Locations
 * hooks use:
 *
 *  - **Reads the service cache during render**, so a response `routeManifest`
 *    already preloaded is used immediately and the page mounts without a
 *    skeleton frame.
 *  - **Keeps the error retryable** — the transport failed, not the visitor.
 */
export function useBuyCatalogue(): BuyResource<BuyCatalogue> {
  const [state, setState] = useState<{ value: BuyCatalogue } | null>(() => {
    const cached = readBuyCatalogue()
    return cached ? { value: cached } : null
  })
  const [failure, setFailure] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCancelled = false

    getBuyCatalogue()
      .then((value) => {
        if (isCancelled) return
        setState({ value })
        setFailure(null)
      })
      .catch(() => {
        if (isCancelled) return
        setFailure("We couldn't load the buying catalogue right now. Please try again.")
      })

    return () => {
      isCancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setFailure(null)
    setAttempt((value) => value + 1)
  }, [])

  const status: BuyRequestStatus = failure ? 'error' : state ? 'success' : 'loading'
  const value = state?.value ?? EMPTY_BUY_CATALOGUE

  return {
    status,
    value,
    isStale: false,
    error: failure,
    isLoading: status === 'loading',
    retry,
  }
}