import { cn } from '@/shared/lib/cn'
import type { HeroSlide } from './heroSlidesData'

interface HeroBackgroundProps {
  slides: readonly HeroSlide[]
  currentSlide: number
  prevSlide: number | null
}

export function HeroBackground({
  slides,
  currentSlide,
  prevSlide,
}: HeroBackgroundProps) {
  return (
    <>
      {/* Auto-Rotating Background Images with Ken Burns Crossfade */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-ink-950">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide
          const isPrev = index === prevSlide

          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                isActive
                  ? 'opacity-100 z-10'
                  : isPrev
                    ? 'opacity-100 z-0'
                    : 'opacity-0 -z-10 pointer-events-none'
              )}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                width={1920}
                height={1080}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
                className={cn(
                  'size-full object-cover transition-transform duration-[7000ms] ease-out',
                  isActive ? 'scale-105' : 'scale-100'
                )}
              />
            </div>
          )
        })}
      </div>

      {/* Gradient dark overlay from bottom to top across the hero image */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/35"
      />
    </>
  )
}
