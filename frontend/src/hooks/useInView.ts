import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  /** Fraction of the element that must be visible. */
  threshold?: number
  /** Stop observing after the first intersection. */
  once?: boolean
  rootMargin?: string
}

const isObserverSupported = () => typeof IntersectionObserver !== 'undefined'

/**
 * Reports when an element enters the viewport.
 * Powers every scroll-reveal animation on the page.
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  once = true,
  rootMargin = '0px 0px -80px 0px',
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(!isObserverSupported())

  useEffect(() => {
    const element = ref.current
    if (!element || !isObserverSupported()) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return { ref, isInView }
}
