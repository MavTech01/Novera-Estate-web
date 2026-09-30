import { useCallback, useEffect, useState } from 'react'

import { fetchPropertyBySlug } from '../data/propertyRepository'
import type { PropertyDetail } from '../types'

/**
 * Loads a single property for `/properties/:slug`.
 *
 * The three request outcomes are kept distinct on purpose: `not-found` renders
 * the "Property Not Found" screen, while `error` is reserved for the transport
 * and 5xx failures that the Express API will produce.
 */
export type PropertyDetailStatus = 'loading' | 'ready' | 'not-found' | 'error'

export interface PropertyDetailState {
  status: PropertyDetailStatus
  property: PropertyDetail | null
  error: string | null
  /** Re-runs the request — used by the error state's "Try again". */
  retry: () => void
}

/**
 * Results are tagged with the request that produced them. A slug change or a
 * retry therefore invalidates the previous result on the spot, so the page goes
 * straight back to its loading state instead of flashing stale data while the
 * next request is in flight.
 */
interface InternalState {
  slug: string
  requestKey: number
  status: PropertyDetailStatus
  property: PropertyDetail | null
}

const loadingState = (slug: string, requestKey: number): InternalState => ({
  slug,
  requestKey,
  status: 'loading',
  property: null,
})

export function usePropertyDetail(slug: string): PropertyDetailState {
  const [requestKey, setRequestKey] = useState(0)
  const [state, setState] = useState<InternalState>(() => loadingState(slug, requestKey))

  useEffect(() => {
    // A stale response from a previous slug must not overwrite the new one.
    let isActive = true

    fetchPropertyBySlug(slug).then(
      (property) => {
        if (!isActive) return
        setState({
          slug,
          requestKey,
          status: property ? 'ready' : 'not-found',
          property,
        })
      },
      () => {
        if (!isActive) return
        setState({ slug, requestKey, status: 'error', property: null })
      },
    )

    return () => {
      isActive = false
    }
  }, [slug, requestKey])

  const retry = useCallback(() => setRequestKey((key) => key + 1), [])

  if (state.slug !== slug || state.requestKey !== requestKey) {
    return { status: 'loading', property: null, error: null, retry }
  }

  return {
    status: state.status,
    property: state.property,
    error: null,
    retry,
  }
}