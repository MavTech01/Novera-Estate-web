import { useCallback, useEffect, useState } from 'react'

import type { Location } from '@/features/locations/types/locationTypes'

/**
 * The request lifecycle shared by every Locations hook.
 *
 * Deliberately generic so the grid, the featured area, the map and the
 * comparison table all agree on what "loading", "stale" and "failed" mean —
 * instead of each reimplementing a `useEffect` with a boolean.
 *
 * Two behaviours matter here:
 *
 *  - **Status is derived, not stored.** It is computed from which response
 *    matches the current query key, so typing in the search box never costs an
 *    extra render pass just to flip a loading flag.
 *  - **Previous data is retained across a refresh.** The grid dims while new
 *    results are in flight rather than collapsing into skeletons on every
 *    keystroke. `isStale` is how a consumer knows the visible data is not yet
 *    for the current query.
 */

export type LocationRequestStatus = 'loading' | 'success' | 'error'

export interface LocationResource<T> {
  status: LocationRequestStatus
  /** The most recent successful value, retained across refreshes. */
  value: T
  /** True when `value` belongs to an earlier query. */
  isStale: boolean
  error: string | null
  isLoading: boolean
  /** Re-runs the request with the same query. */
  retry: () => void
}

/** Stable empty value, so consumers never see a fresh array identity. */
export const EMPTY_LOCATIONS: Location[] = []

/** Stable empty aggregate for the count/table hooks. */
export const EMPTY_RECORD: Record<string, never> = {}

interface ResourceState<T> {
  key: string
  value: T
}

export function useLocationResource<T>(
  load: () => Promise<T>,
  queryKey: string,
  emptyValue: T,
  /**
   * Reads a value already in the service cache, or `undefined` when there is
   * none. Consulted *during render*, not in an effect, so a response the route
   * preloader already fetched is used immediately: the hook mounts already
   * `success` and never renders skeletons for data sitting in memory.
   *
   * `undefined` is meaningful and distinct from a cached `null` — `null` is a
   * legitimate "this slug does not exist" answer and must not trigger a refetch.
   */
  readCached?: () => T | undefined,
): LocationResource<T> {
  const [state, setState] = useState<ResourceState<T> | null>(() => {
    const cached = readCached?.()

    return cached === undefined ? null : { key: queryKey, value: cached }
  })
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCancelled = false

    load()
      .then((value) => {
        if (isCancelled) return
        setState({ key: queryKey, value })
      })
      .catch(() => {
        if (isCancelled) return
        setFailure({ key: queryKey, message: "We couldn't load our locations right now." })
      })

    return () => {
      isCancelled = true
    }
    // `queryKey` encodes every input; depending on `load` itself would refetch
    // on every render because it is recreated each time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey, attempt])

  const retry = useCallback(() => {
    setFailure(null)
    setAttempt((value) => value + 1)
  }, [])

  const isError = failure?.key === queryKey
  const isStale = state !== null && state.key !== queryKey
  const status: LocationRequestStatus = isError ? 'error' : state?.key === queryKey ? 'success' : 'loading'
  const value = state !== null && state.key === queryKey ? state.value : (state?.value ?? emptyValue)

  return {
    status,
    value,
    isStale,
    error: isError ? failure.message : null,
    isLoading: status === 'loading',
    retry,
  }
}
