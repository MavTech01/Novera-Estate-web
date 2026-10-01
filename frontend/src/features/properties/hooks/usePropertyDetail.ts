import { useCallback, useEffect, useState } from 'react'

import { fetchPropertyBySlug, readPropertyBySlug } from '@/data/propertyRepository'
import type { PropertyDetail } from '@/types'

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
 * Results are tagged with the request that produced them, so a slug change or a
 * retry invalidates the previous result on the spot instead of leaving stale
 * property data on screen.
 */
interface InternalState {
  slug: string
  requestKey: number
  status: PropertyDetailStatus
  property: PropertyDetail | null
}

/**
 * Reads the repository cache without touching the network.
 *
 * `undefined` means "not cached yet", `null` means "cached, and there is no such
 * listing" — the difference between "still loading" and "loaded, not found".
 *
 * A route transition preloads its destination before committing it, so on
 * arrival this is normally populated and the page renders real content on the
 * first frame. The skeleton is then only needed for a cold deep link or a retry.
 */
function readCached(slug: string): { status: PropertyDetailStatus; property: PropertyDetail | null } | null {
  const cached = readPropertyBySlug(slug)
  if (cached === undefined) return null

  return { status: cached ? 'ready' : 'not-found', property: cached }
}

export function usePropertyDetail(slug: string): PropertyDetailState {
  const [requestKey, setRequestKey] = useState(0)
  const [state, setState] = useState<InternalState | null>(null)

  useEffect(() => {
    // A stale response from a previous slug must not overwrite the new one.
    let isActive = true

    // Resolves from the cache when a transition already warmed it.
    fetchPropertyBySlug(slug).then(
      (property) => {
        if (!isActive) return
        setState({ slug, requestKey, status: property ? 'ready' : 'not-found', property })
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

  const isCurrent = state !== null && state.slug === slug && state.requestKey === requestKey

  if (isCurrent) {
    return { status: state.status, property: state.property, error: null, retry }
  }

  // A superseded result resolves from the cache when there is one, so a
  // committed route never flashes its loading state.
  const cached = readCached(slug)
  if (cached) return { ...cached, error: null, retry }

  return { status: 'loading', property: null, error: null, retry }
}