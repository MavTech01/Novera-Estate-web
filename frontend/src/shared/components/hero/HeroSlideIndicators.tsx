import type { CSSProperties } from 'react'

import { cn } from '@/shared/lib/cn'
import type { HeroSlide } from './heroSlidesData'

interface HeroSlideIndicatorsProps {
  slides: readonly HeroSlide[]
  currentSlide: number
  onSelectSlide: (index: number) => void
  className?: string
  style?: CSSProperties
}

export function HeroSlideIndicators({
  slides,
  currentSlide,
  onSelectSlide,
  className,
  style,
}: HeroSlideIndicatorsProps) {
  if (slides.length <= 1) return null

  return (
    <nav
      aria-label="Hero background slides"
      style={style}
      className={cn(
        'absolute right-3.5 sm:right-6 lg:right-8 bottom-16 sm:bottom-20 lg:bottom-24 z-20 flex flex-col items-end gap-2 sm:gap-3',
        className
      )}
    >
      {slides.map((slide, idx) => {
        const isActive = idx === currentSlide
        const num = String(idx + 1).padStart(2, '0')

        return (
          <button
            key={slide.src}
            type="button"
            onClick={() => onSelectSlide(idx)}
            className="group flex items-center gap-1.5 sm:gap-2.5 py-0.5 sm:py-1 text-right rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            aria-label={`Go to slide ${idx + 1}: ${slide.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Slide Title - revealed on desktop for the active slide or on hover */}
            <span
              className={cn(
                'hidden lg:inline-block font-sans text-xs tracking-wide transition-all duration-300 select-none',
                isActive
                  ? 'opacity-100 text-sand-100 font-medium translate-x-0'
                  : 'opacity-0 text-white/60 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none'
              )}
            >
              {slide.label}
            </span>

            {/* Architectural Slide Number */}
            <span
              className={cn(
                'font-mono text-[11px] sm:text-xs transition-colors duration-300 select-none',
                isActive
                  ? 'text-white font-bold'
                  : 'text-white/40 group-hover:text-white/80'
              )}
            >
              {num}
            </span>

            {/* Indicator Accent Line */}
            <span
              className={cn(
                'block h-[2px] rounded-full transition-all duration-500 ease-out',
                isActive
                  ? 'w-6 sm:w-9 bg-accent-500 shadow-[0_0_10px_rgba(249,115,22,0.85)]'
                  : 'w-2.5 sm:w-3.5 bg-white/30 group-hover:w-4 sm:group-hover:w-5 group-hover:bg-white/60'
              )}
            />
          </button>
        )
      })}
    </nav>
  )
}
