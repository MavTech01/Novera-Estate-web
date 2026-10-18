import { useEffect, useState } from 'react'

export type RoutePhase = 'idle' | 'active' | 'exiting'

const EXIT_MS = 220

export function useRoutePhase(isPageChange: boolean): RoutePhase {
  const [isFading, setIsFading] = useState(false)
  const [wasChanging, setWasChanging] = useState(isPageChange)

  if (wasChanging !== isPageChange) {
    setWasChanging(isPageChange)
    if (!isPageChange) setIsFading(true)
  }

  useEffect(() => {
    if (isPageChange || !isFading) return

    const done = setTimeout(() => setIsFading(false), EXIT_MS)
    return () => clearTimeout(done)
  }, [isPageChange, isFading])

  if (isPageChange) return 'active'
  return isFading ? 'exiting' : 'idle'
}
