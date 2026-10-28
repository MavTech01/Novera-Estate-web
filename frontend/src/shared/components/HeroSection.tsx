import type { CSSProperties } from 'react'

import type { PropertyPurpose, PropertySearchCriteria, PropertyType } from '@/types'
import { Container } from '@/shared/components/ui/Container'
import { WaveDivider } from '@/shared/components/layout/WaveDivider'
import {
  HeroBackground,
  HeroHeading,
  HeroPurposeTabs,
  HeroSearchBar,
  HeroSlideIndicators,
  HeroStats,
  useHeroCarousel,
} from './hero'

const delay = (ms: number): CSSProperties =>
  ({ '--hero-delay': `${ms}ms` } as CSSProperties)

interface HeroSectionProps {
  criteria: PropertySearchCriteria
  onPurposeChange: (purpose: PropertyPurpose) => void
  onLocationChange: (location: string) => void
  onTypeChange: (type: PropertyType | 'any') => void
  onPriceChange: (price: string) => void
  onSubmit: () => void
}

export function HeroSection({
  criteria,
  onPurposeChange,
  onLocationChange,
  onTypeChange,
  onPriceChange,
  onSubmit,
}: HeroSectionProps) {
  const {
    slides,
    currentSlide,
    prevSlide,
    goToSlide,
    setIsHovered,
  } = useHeroCarousel()

  return (
    <section
      className="relative isolate z-30 flex min-h-screen flex-col justify-between bg-ink-950 pt-28 sm:pt-32 lg:pt-36"
      aria-labelledby="hero-heading"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Auto-Rotating Background Images with Ken Burns Crossfade */}
      <HeroBackground
        slides={slides}
        currentSlide={currentSlide}
        prevSlide={prevSlide}
      />

      <Container className="my-auto">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Main Headline & Subtitle */}
          <HeroHeading slides={slides} currentSlide={currentSlide} />

          {/* Search Bar, Filters, Stats & Slide Controls */}
          <div className="mt-9 w-full max-w-xl">
            <div className="hero-fade" style={delay(500)}>
              <HeroPurposeTabs
                purpose={criteria.purpose}
                onChange={onPurposeChange}
                className="mb-3"
              />
            </div>

            <div className="hero-fade" style={delay(620)}>
              <HeroSearchBar
                criteria={criteria}
                onLocationChange={onLocationChange}
                onTypeChange={onTypeChange}
                onPriceChange={onPriceChange}
                onSubmit={onSubmit}
              />
            </div>

            {/* Stats directly beneath search bar */}
            <div className="hero-fade" style={delay(740)}>
              <HeroStats />
            </div>
          </div>
        </div>
      </Container>

      {/* Floating Vertical Side Rail (Right Edge) */}
      <HeroSlideIndicators
        slides={slides}
        currentSlide={currentSlide}
        onSelectSlide={goToSlide}
        className="hero-fade"
        style={delay(860)}
      />

      {/* Decorative Wave Divider flush at the bottom edge */}
      <WaveDivider color="white" className="relative z-10 mt-auto" />
    </section>
  )
}
