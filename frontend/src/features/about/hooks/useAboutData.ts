import { useEffect, useState } from 'react'

import { getAboutContent, readAboutContent } from '@/features/about/services/aboutService'
import type { AboutNotice, AboutPageContent } from '@/features/about/types/aboutTypes'

/**
 * Request hook for the About page.
 *
 * The whole page is a single record that does not change while it is open, so
 * this is a deliberately small hook rather than the list-oriented resource
 * lifecycle the Locations and Projects features use. There is nothing to
 * filter, page or invalidate, and borrowing that machinery would import a
 * locations-owned hook across a feature boundary to handle one request.
 *
 * What it still does is the part that matters:
 *
 *  - **Reads the service cache during render**, not in an effect, so a response
 *    `routeManifest` already preloaded is used immediately. The page mounts with
 *    its content instead of rendering skeletons for data already in memory.
 *  - **Keeps the error message generic and retryable**, because the failure is
 *    the transport's, not the visitor's.
 */

export type AboutRequestStatus = 'loading' | 'success' | 'error'

export interface AboutResource {
  status: AboutRequestStatus
  value: AboutPageContent | null
  error: string | null
  isLoading: boolean
  /** Re-runs the request. */
  retry: () => void
}

interface AboutState {
  value: AboutPageContent | null
  error: string | null
}

export function useAboutContent(): AboutResource {
  // `readAboutContent` is consulted once on mount only: the About record does
  // not vary by query, so a later cache miss would be a bug, not new data.
  const [state, setState] = useState<AboutState>(() => {
    const cached = readAboutContent()

    return cached ? { value: cached, error: null } : { value: null, error: null }
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCancelled = false

    getAboutContent()
      .then((value) => {
        if (isCancelled) return
        setState({ value, error: null })
      })
      .catch(() => {
        if (isCancelled) return
        setState({
          value: null,
          error: "We couldn't load this page right now. Please try again in a moment.",
        })
      })

    return () => {
      isCancelled = true
    }
  }, [attempt])

  const isLoading = state.value === null && state.error === null

  return {
    status: state.error ? 'error' : isLoading ? 'loading' : 'success',
    value: state.value,
    error: state.error,
    isLoading,
    retry: () => setAttempt((value) => value + 1),
  }
}

/**
 * Finds a notice by id.
 *
 * Returns `undefined` rather than an empty notice so a caller can skip
 * rendering entirely instead of leaving a disclosure box with nothing in it.
 */
export function findNotice(notices: readonly AboutNotice[], id: string): AboutNotice | undefined {
  return notices.find((notice) => notice.id === id)
}