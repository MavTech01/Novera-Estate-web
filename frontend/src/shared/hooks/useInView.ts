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
 *
 * `threshold` is `0` — *any* pixel counts — and that is deliberate rather than
 * lazy. The reported ratio is `visible area / element area`, so for an element
 * taller than the viewport it is capped at `viewport / elementHeight`. At the
 * old default of `0.15`, a `Reveal` wrapper more than roughly 4800px tall in an
 * 800px viewport could never reach the threshold, and because `.reveal` starts
 * at `opacity: 0` that content stayed invisible forever — permanently blank
 * sections. Tall sections are exactly what this hook wraps.
 *
 * The negative bottom `rootMargin` supplies the "wait until it has properly
 * started to enter" feel the threshold used to provide, and it shrinks the root
 * rather than the element, so it cannot reintroduce the ratio problem.
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0,
  once = true,
  rootMargin = '0px 0px -64px 0px',
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
