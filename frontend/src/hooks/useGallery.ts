import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Active-image index for the property gallery and the lightbox.
 *
 * Wrapping is intentional: moving past the last photo returns to the first, so
 * "next" always feels responsive instead of dead-ending.
 */
export function useGallery(count: number) {
  const [rawIndex, setIndex] = useState(0)
  const total = Math.max(count, 0)

  // A listing change can shrink the gallery under the current index, so the
  // selection is clamped as it is read. Deriving rather than correcting in an
  // effect avoids a wasted render on every navigation.
  const index = total === 0 ? 0 : Math.min(rawIndex, total - 1)

  const goTo = useCallback(
    (nextIndex: number) => {
      if (total === 0) return
      setIndex(((nextIndex % total) + total) % total)
    },
    [total],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const previous = useCallback(() => goTo(index - 1), [goTo, index])

  return { index, goTo, next, previous, total }
}

/**
 * Calls `handler` on ArrowLeft / ArrowRight while `isActive` is true.
 * Returns a ref to attach to the element that should receive the keys — the
 * gallery only responds when it (or the lightbox) holds focus.
 */
export function useGalleryKeyboard({
  onPrevious,
  onNext,
  isActive = true,
}: {
  onPrevious: () => void
  onNext: () => void
  isActive?: boolean
}) {
  const targetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onPrevious()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNext()
      }
    }

    const target = targetRef.current
    target?.addEventListener('keydown', onKeyDown)

    return () => target?.removeEventListener('keydown', onKeyDown)
  }, [isActive, onNext, onPrevious])

  return targetRef
}