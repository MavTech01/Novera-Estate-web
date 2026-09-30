import { useCallback, useEffect, useMemo, useState } from 'react'

import { PROPERTIES_PER_PAGE } from '../data/propertyFilters'
import { fetchProperties, type PropertyListingPage } from '../data/propertyRepository'
import { serialiseQuery } from '../lib/propertyQuery'
import type { PropertyFilters, PropertySort } from '../types'

export type ListingStatus = 'loading' | 'success' | 'error'

export interface PropertyListing {
  status: ListingStatus
  /**
   * The most recent successful page.
   * Retained while a new request is in flight so the grid dims rather than
   * collapsing into skeletons on every keystroke.
   */
  results: PropertyListingPage | null
  /** True while `results` belongs to an earlier query. */
  isStale: boolean
  error: string | null
  isLoading: boolean
  /** Re-runs the request with the same query. */
  retry: () => void
}

export interface PropertyListingRequest {
  filters: PropertyFilters
  sort: PropertySort
  page: number
  perPage?: number
}

interface Response {
  /** The query key this response belongs to — used to detect staleness. */
  key: string
  page: PropertyListingPage
}

/**
 * Runs the listing query and exposes the three states the page renders.
 *
 * Status is *derived* from which response matches the current query rather than
 * stored separately, so a filter change never causes an extra render pass just
 * to flip a loading flag.
 *
 * Everything it touches is the repository interface, so swapping the mock for
 * `GET /api/properties` keeps this hook — and everything above it — identical.
 */
export function usePropertyListing({
  filters,
  sort,
  page,
  perPage = PROPERTIES_PER_PAGE,
}: PropertyListingRequest): PropertyListing {
  const [response, setResponse] = useState<Response | null>(null)
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null)
  const [attempt, setAttempt] = useState(0)

  // A stable key: any change to the query re-runs the request, nothing else does.
  const queryKey = useMemo(
    () => `${serialiseQuery(filters, sort, page).toString()}#${attempt}`,
    [filters, sort, page, attempt],
  )

  useEffect(() => {
    let isCancelled = false

    fetchProperties({ filters, sort, page, perPage })
      .then((result) => {
        if (isCancelled) return
        setResponse({ key: queryKey, page: result })
      })
      .catch(() => {
        if (isCancelled) return
        setFailure({
          key: queryKey,
          message: "We couldn't load the properties right now. Please try again.",
        })
      })

    return () => {
      isCancelled = true
    }
    // `queryKey` encodes every input; depending on the objects themselves would
    // refetch on every render if a caller passed fresh literals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  const retry = useCallback(() => {
    setFailure(null)
    setAttempt((value) => value + 1)
  }, [])

  const isError = failure?.key === queryKey
  const isStale = response !== null && response.key !== queryKey
  const status: ListingStatus = isError ? 'error' : response?.key === queryKey ? 'success' : 'loading'

  return {
    status,
    results: response?.page ?? null,
    isStale,
    error: isError ? failure.message : null,
    isLoading: status === 'loading',
    retry,
  }
}
