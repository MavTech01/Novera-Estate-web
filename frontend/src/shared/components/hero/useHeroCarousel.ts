import { useCallback, useEffect, useState } from 'react'

import { HERO_ROTATION_INTERVAL, HERO_SLIDES, type HeroSlide } from './heroSlidesData'

interface UseHeroCarouselOptions {
  slides?: readonly HeroSlide[]
  interval?: number
}

export function useHeroCarousel(options: UseHeroCarouselOptions = {}) {
  const slides = options.slides ?? HERO_SLIDES
  const interval = options.interval ?? HERO_ROTATION_INTERVAL

  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevSlide, setPrevSlide] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Preload all slides into browser cache on mount
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image()
      img.src = slide.src
    })
  }, [slides])

  const goToSlide = useCallback((nextIndex: number) => {
    setCurrentSlide((curr) => {
      if (curr === nextIndex) return curr
      setPrevSlide(curr)
      return nextIndex
    })
  }, [])

  // Clear previous slide once crossfade completes (1000ms transition)
  useEffect(() => {
    if (prevSlide === null) return
    const timer = setTimeout(() => {
      setPrevSlide(null)
    }, 1100)
    return () => clearTimeout(timer)
  }, [prevSlide])

  // Auto-rotation timer (pauses when hovered or tab is hidden)
  useEffect(() => {
    if (isHovered || slides.length <= 1) return

    const timer = setInterval(() => {
      if (document.hidden) return
      goToSlide((currentSlide + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [isHovered, currentSlide, slides.length, interval, goToSlide])

  return {
    slides,
    currentSlide,
    prevSlide,
    goToSlide,
    isHovered,
    setIsHovered,
  }
}
