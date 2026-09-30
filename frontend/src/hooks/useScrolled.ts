import { useEffect, useState } from 'react'

/**
 * True once the page has scrolled past `offset` pixels.
 * Used to switch the navigation bar from its transparent to its solid state.
 */
export function useScrolled(offset = 24): boolean {
  const [isScrolled, setIsScrolled] = useState(() =>
    typeof window === 'undefined' ? false : window.scrollY > offset,
  )

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > offset)

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return isScrolled
}
