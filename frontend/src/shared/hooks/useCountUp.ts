import { useEffect, useRef, useState } from 'react'

import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface UseCountUpOptions {
  /** Total animation time in milliseconds. */
  duration?: number
  /** Delay before the counter starts, in milliseconds. */
  delay?: number
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

/**
 * Counts up to `target` once `active` becomes true.
 * Falls back to the final value instantly when reduced motion is preferred.
 */
export function useCountUp(target: number, active: boolean, { duration = 1600, delay = 120 }: UseCountUpOptions = {}) {
  const [count, setCount] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active || prefersReducedMotion) return

    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime

      if (elapsed < delay) {
        frameRef.current = requestAnimationFrame(step)
        return
      }

      const progress = Math.min((elapsed - delay) / duration, 1)
      setCount(Math.round(target * easeOutExpo(progress)))

      if (progress < 1) frameRef.current = requestAnimationFrame(step)
    }

    frameRef.current = requestAnimationFrame(step)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [active, delay, duration, prefersReducedMotion, target])

  return prefersReducedMotion ? target : count
}
