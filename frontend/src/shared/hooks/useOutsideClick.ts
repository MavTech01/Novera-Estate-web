import { useEffect, type RefObject } from 'react'

/**
 * Calls `handler` when a pointer press or focus lands outside `ref`.
 * Used by popovers that have to dismiss on outside interaction without stealing
 * focus from the rest of the page.
 */
export function useOutsideClick(ref: RefObject<HTMLElement | null>, handler: () => void, isActive = true) {
  useEffect(() => {
    if (!isActive) return

    const onInteraction = (event: MouseEvent | FocusEvent) => {
      const element = ref.current
      if (element && !element.contains(event.target as Node)) handler()
    }

    document.addEventListener('mousedown', onInteraction)
    document.addEventListener('focusin', onInteraction)

    return () => {
      document.removeEventListener('mousedown', onInteraction)
      document.removeEventListener('focusin', onInteraction)
    }
  }, [handler, isActive, ref])
}
