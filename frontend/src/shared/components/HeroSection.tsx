import { images } from '@/assets/images'
import type { PropertyPurpose, PropertySearchCriteria, PropertyType } from '@/types'
import { Container } from '@/shared/components/ui/Container'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { WaveDivider } from '@/shared/components/layout/WaveDivider'
import { HeroPurposeTabs, HeroSearchBar, HeroStats } from './hero'

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
  return (
    <section
      className="relative isolate z-30 flex min-h-screen flex-col justify-between bg-ink-950 pt-28 sm:pt-32 lg:pt-36"
      aria-labelledby="hero-heading"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <SkeletonImage
          src={images.hero.main}
          alt="Contemporary luxury villa with pool at dusk, photographed for Novera Estates"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          className="size-full object-cover"
        />
      </div>

      {/* Gradient dark overlay from bottom to top across the hero image */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
      />

      <Container className="my-auto">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Headline */}
          <h1
            id="hero-heading"
            className="max-w-3xl font-display text-[2.75rem] font-extrabold tracking-tight text-white leading-[1.08]  sm:text-5xl lg:text-6xl"
          >
            Find a Place <br />
            That <span className="">Feels Like Yours.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-xl text-base leading-snug text-sand-100 sm:text-lg sm:leading-normal font-thin">
            Curated luxury homes and investment opportunities in premium locations.
          </p>

          {/* Search & Filters Section */}
          <div className="mt-9 w-full max-w-xl">
            {/* Purpose Tabs (Buy / Rent) */}
            <HeroPurposeTabs
              purpose={criteria.purpose}
              onChange={onPurposeChange}
              className="mb-3"
            />

            {/* Search Bar with Location Input & Filter Popover */}
            <HeroSearchBar
              criteria={criteria}
              onLocationChange={onLocationChange}
              onTypeChange={onTypeChange}
              onPriceChange={onPriceChange}
              onSubmit={onSubmit}
            />

            {/* Stats directly beneath search bar */}
            <HeroStats />
          </div>
        </div>
      </Container>

      {/* Decorative Wave Divider flush at the bottom edge */}
      <WaveDivider color="white" className="relative z-10 mt-auto" />
    </section>
  )
}
