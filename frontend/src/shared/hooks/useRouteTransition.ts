import { useEffect, useSyncExternalStore } from 'react'

import {
  ensureBootLoad,
  getRouteTransitionSnapshot,
  subscribeToRouteTransition,
  type RouteTransitionState,
} from '@/shared/lib/routeTransition'

/**
 * Route transition state for components.
 *
 * The store lives outside React so a navigation can be started from anywhere —
 * a link, a keyboard shortcut, `popstate` — without a component owning it.
 */
export function useRouteTransition(): RouteTransitionState {
  const state = useSyncExternalStore(
    subscribeToRouteTransition,
    getRouteTransitionSnapshot,
    getRouteTransitionSnapshot,
  )

  // Warm the first route's data so a deep link paints content, not a skeleton.
  useEffect(() => {
    ensureBootLoad()
  }, [])

  return state
}