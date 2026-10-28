import { useEffect, useRef, useState } from 'react'

interface UseStepperProgressOptions {
  /** Fraction of a step that must be visible before it fades in. */
  revealThreshold?: number
  /** Shrinks the viewport from the bottom so nothing animates in down at the edge. */
  revealMargin?: string
}

export interface StepperProgress {
  /** Ref callback for the step element — used for the one-shot fade-in. */
  registerItem: (index: number) => (node: HTMLElement | null) => void
  /** Ref callback for the element sitting at the step's visual centre. */
  registerMarker: (index: number) => (node: HTMLElement | null) => void
  /** True once a step has animated in; never resets, so it only plays once. */
  isRevealed: (index: number) => boolean
  /** Index of the step holding the active styling. Follows the scroll in both
   *  directions, so scrolling back up hands it to the earlier step again. */
  activeIndex: number
}

const observerSupported = typeof IntersectionObserver !== 'undefined'
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Drives the stepper's scroll behaviour:
 *
 * 1. **Reveal** — a step fades and slides in the first time it is 20% visible
 *    and clear of the bottom edge, then unobserves. One-shot by design, and
 *    threshold-based, so `IntersectionObserver` fits it well.
 * 2. **Active** — which step is "current" depends on how the steps are laid out,
 *    so the layout is measured rather than assumed:
 *      - *Stacked* (below `md`): the step whose centre is nearest the vertical
 *        centre of the viewport.
 *      - *Row* (`md` up): the steps share a single height, so proximity is a
 *        permanent tie. Progress instead follows the row's own travel, measured
 *        across the stretch where the row is fully on screen.
 *
 *    Either way it is measured every animation frame rather than watched through
 *    an observer: an observer only reports band *transitions*, so a quick flick
 *    can carry a step straight over a band without a callback ever firing, and
 *    the previous step stays stuck as "current". Measuring the distance has no
 *    window to miss, tracks the scroll exactly, and reverses for free.
 */
export function useStepperProgress(
  count: number,
  {
    revealThreshold = 0.2,
    revealMargin = '0px 0px -20% 0px',
  }: UseStepperProgressOptions = {},
): StepperProgress {
  const items = useRef<(HTMLElement | null)[]>([])
  const markers = useRef<(HTMLElement | null)[]>([])
  // Element → step index, resolved from the ref that registered the node
  // rather than from a data attribute, so an observer entry can never end up
  // unattributed.
  const indices = useRef<Map<Element, number>>(new Map())
  const revealedRef = useRef<boolean[]>(Array.from({ length: count }, () => false))

  // Nothing to observe: start out settled.
  const startsRevealed = !observerSupported

  const [isRevealed, setIsRevealed] = useState<boolean[]>(() => Array.from({ length: count }, () => startsRevealed))
  const [activeIndex, setActiveIndex] = useState(() => (observerSupported ? -1 : count - 1))

  useEffect(() => {
    if (!observerSupported) return

    const itemElements = items.current
    if (itemElements.length === 0) return

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const index = indices.current.get(entry.target)
          if (index === undefined || revealedRef.current[index]) continue

          revealedRef.current[index] = true
          setIsRevealed(revealedRef.current.slice())
          revealObserver.unobserve(entry.target)
        }
      },
      { threshold: revealThreshold, rootMargin: revealMargin },
    )

    itemElements.forEach((element) => {
      if (element) revealObserver.observe(element)
    })

    let lastIndex = -1

    const syncActiveStep = () => {
      const viewport = window.innerHeight
      let nextIndex = -1

      // Tell the two layouts apart by measuring them. Stacked steps each sit at
      // their own height; side-by-side steps all share one, so proximity to the
      // focus line is a permanent tie and says nothing about which step to show.
      const firstMarker = markers.current.find(Boolean)
      const firstTop = firstMarker?.getBoundingClientRect().top
      const isRow = firstTop !== undefined && markers.current.every((marker) => {
        if (!marker) return false
        return Math.abs(marker.getBoundingClientRect().top - firstTop) < 2
      })

      // How much of the viewport the row leaves free while it is fully visible.
      const rowRect = isRow ? items.current.find(Boolean)?.getBoundingClientRect() : undefined
      const readable = rowRect ? viewport - rowRect.height : 0

      if (rowRect && readable > 1) {
        // Row layout: progress follows the row's travel across the stretch where
        // it is fully on screen, starting as soon as it first is.
        //
        // Normalising over the row's whole enter-to-exit journey instead — which
        // is `viewport + rowHeight` — makes the hand-off fire proportionally
        // earlier the shorter the viewport, because the row occupies more of the
        // screen. On a landscape tablet that put the last step's activation right
        // as the row was leaving. Anchoring to the readable window keeps every
        // hand-off on screen at any size, and reverses exactly on the way back.
        const travelled = viewport - rowRect.top
        const progress = clamp((travelled - rowRect.height) / readable, 0, 1)
        nextIndex = Math.min(count - 1, Math.floor(progress * count))
      } else {
        // Stacked layout — or a row taller than the viewport, which is never
        // fully visible and so has no readable window to measure. Either way the
        // step whose centre is nearest the middle of the viewport is the one being
        // looked at.
        const focusLine = viewport / 2
        let closestDistance = Number.POSITIVE_INFINITY

        for (let index = 0; index < count; index += 1) {
          const marker = markers.current[index]
          if (!marker) continue

          const distance = Math.abs(marker.getBoundingClientRect().top - focusLine)
          if (distance < closestDistance) {
            closestDistance = distance
            nextIndex = index
          }
        }
      }

      // Always resolve to *something*: derived from the current position on
      // every frame, never carried over from the last one.
      if (nextIndex >= 0 && nextIndex !== lastIndex) {
        lastIndex = nextIndex
        setActiveIndex(nextIndex)
      }
    }

    let frame = 0
    const onFrame = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        syncActiveStep()
      })
    }

    syncActiveStep()
    window.addEventListener('scroll', onFrame, { passive: true })
    window.addEventListener('resize', onFrame)

    return () => {
      revealObserver.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onFrame)
      window.removeEventListener('resize', onFrame)
    }
  }, [count, revealMargin, revealThreshold])

  return {
    registerItem: (index: number) => (node: HTMLElement | null) => {
      const previous = items.current[index]
      if (previous) indices.current.delete(previous)
      items.current[index] = node
      if (node) indices.current.set(node, index)
    },
    registerMarker: (index: number) => (node: HTMLElement | null) => {
      const previous = markers.current[index]
      if (previous) indices.current.delete(previous)
      markers.current[index] = node
      if (node) indices.current.set(node, index)
    },
    isRevealed: (index: number) => isRevealed[index] ?? true,
    activeIndex,
  }
}
