import type { CSSProperties } from 'react'

import { cn } from '@/shared/lib/cn'
import { HERO_SLIDES, type HeroSlide } from './heroSlidesData'

const delay = (ms: number): CSSProperties =>
  ({ '--hero-delay': `${ms}ms` } as CSSProperties)

interface HeroHeadingProps {
  slides?: readonly HeroSlide[]
  currentSlide?: number
}

export function HeroHeading({
  slides = HERO_SLIDES,
  currentSlide = 0,
}: HeroHeadingProps) {
  return (
    <div className="grid grid-cols-1 grid-rows-1 items-center justify-items-center w-full">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide

        return (
          <div
            key={slide.label}
            aria-hidden={!isActive}
            className={cn(
              'col-start-1 row-start-1 flex flex-col items-center text-center transition-all duration-700 ease-out',
              isActive
                ? 'opacity-100 translate-y-0 filter-none pointer-events-auto'
                : 'opacity-0 -translate-y-2.5 blur-[3px] pointer-events-none'
            )}
          >
            {/* Headline */}
            <h1
              id={isActive ? 'hero-heading' : undefined}
              className="max-w-3xl font-display text-[clamp(1.9rem,6.8vw,3.75rem)] font-extrabold tracking-tight text-white leading-[1.12] sm:text-[clamp(2.25rem,6.5vw,3.75rem)] sm:leading-[1.08]"
            >
              <span
                className={index === 0 ? 'hero-word' : undefined}
                style={index === 0 ? delay(0) : undefined}
              >
                {slide.headlineLine1}
              </span>{' '}
              <br />
              <span
                className={index === 0 ? 'hero-word' : undefined}
                style={index === 0 ? delay(140) : undefined}
              >
                {slide.headlineLine2Prefix}
              </span>{' '}
              <span
                className={cn(
                  'inline-block max-w-full drop-shadow-[0_0_24px_rgba(249,115,22,0.4)]',
                  index === 0 && 'hero-word'
                )}
                style={index === 0 ? delay(240) : undefined}
              >
                <span className="hero-gradient-text">
                  {slide.headlineLine2Highlight}
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                'mt-2 max-w-xl text-[clamp(0.9375rem,2.2vw,1.2rem)] leading-snug text-sand-100 font-thin sm:mt-2.5',
                index === 0 && 'hero-fade'
              )}
              style={index === 0 ? delay(380) : undefined}
            >
              {slide.subtitle}
            </p>
          </div>
        )
      })}
    </div>
  )
}
