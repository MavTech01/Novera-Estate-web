import { useMemo, useSyncExternalStore } from 'react'

import { locationKey, navigate, type ParsedLocation } from '@/shared/lib/location'
import { getRouteTransitionSnapshot, subscribeToRouteTransition } from '@/shared/lib/routeTransition'

/**
 * React bindings for the router.
 *
 * Reads the *committed* location, not `window.location`. Those differ for the
 * duration of a navigation — the URL updates on click so it stays shareable and
 * back/forward behave, while the page on screen stays put until its data has
 * loaded. Reading the committed location is what keeps a page's own queries
 * consistent with what is actually rendered.
 */

export interface RouterState extends ParsedLocation {
  /** `path` plus query, used as a cache key. */
  key: string
}

export function useRouter(): RouterState {
  const { location } = useSyncExternalStore(
    subscribeToRouteTransition,
    getRouteTransitionSnapshot,
    getRouteTransitionSnapshot,
  )

  return useMemo(
    () => ({ path: location.path, query: location.query, key: locationKey(location) }),
    [location],
  )
}

export { navigate }
export { replaceSearchParams } from '@/shared/lib/location'