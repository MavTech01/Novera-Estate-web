import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const getInitialPreference = () =>
  typeof window === 'undefined' ? false : window.matchMedia(QUERY).matches

/**
 * Tracks `prefers-reduced-motion` so animated components can degrade to a
 * static, fully readable state.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialPreference)

  useEffect(() => {
    const query = window.matchMedia(QUERY)

    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return prefersReducedMotion
}
