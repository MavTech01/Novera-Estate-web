import { useEffect, useState } from 'react'

const isObserverSupported = () => typeof IntersectionObserver !== 'undefined'

/**
 * Reports whether an element matching `selector` is on screen.
 *
 * Used by floating UI (the mobile action bar) that should get out of the way
 * before it can cover the page footer. Falls back to `false` when the element
 * is missing or the observer is unavailable, so the floating element simply
 * keeps its normal behaviour.
 */
export function useElementInView(selector: string, rootMargin = '0px'): boolean {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!isObserverSupported()) return

    const element = document.querySelector(selector)
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { rootMargin })

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, selector])

  return isInView
}
