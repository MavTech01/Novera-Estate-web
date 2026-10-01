import { useEffect, useRef } from 'react'

/**
 * Translates a hero's photograph as the page scrolls, so the image drifts
 * slower than the copy in front of it.
 *
 * The transform is written straight to the element inside a rAF-throttled
 * scroll handler — no React state, so scrolling never re-renders. The offset is
 * capped at a fraction of the surrounding section's height, which keeps the
 * (oversized) image covering its frame at every scroll position. Disabled
 * entirely under `prefers-reduced-motion`.
 */
export function useHeroParallax<T extends HTMLElement>(factor = 0.12) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const update = () => {
      frame = 0
      const frameHeight = element.parentElement?.offsetHeight ?? element.offsetHeight
      const offset = Math.min(window.scrollY * factor, frameHeight * 0.12)
      element.style.transform = `translate3d(0, ${offset}px, 0)`
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [factor])

  return ref
}
