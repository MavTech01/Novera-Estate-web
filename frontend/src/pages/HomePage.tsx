import { AboutSection } from '@/features/about/components/AboutSection'
import { BlogPreview } from '@/features/news/components/BlogPreview'
import { CTASection } from '@/shared/components/CTASection'
import { FeaturedDevelopment } from '@/features/projects/components/FeaturedDevelopment'
import { HeroSearchOverlay } from '@/shared/components/HeroSearchOverlay'
import { HeroSection } from '@/shared/components/HeroSection'
import { LocationsSection } from '@/features/locations/components/LocationsSection'
import { HowItWorks } from '@/shared/components/HowItWorks'
import { FeaturedProperties } from '@/shared/components/properties/FeaturedProperties'
import { PropertyTypes } from '@/shared/components/properties/PropertyTypes'
import { ServicesCarousel } from '@/shared/components/ServicesCarousel'
import { Testimonials } from '@/shared/components/Testimonials'
import { WhyChooseUs } from '@/shared/components/WhyChooseUs'
import { getFeaturedProperties } from '@/data'
import { usePropertySearch } from '@/features/properties/hooks/usePropertySearch'

/**
 * Landing page — composes every homepage section in order.
 * The navigation bar is rendered once by `App`, outside the route outlet.
 */
export function HomePage() {
  const { criteria, updateCriteria, submit, reset, results, isSearching } = usePropertySearch()

  const visibleProperties = isSearching ? results : getFeaturedProperties()

  const handleSearch = () => {
    submit()
    window.requestAnimationFrame(() => {
      document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <HeroSection />

      <HeroSearchOverlay criteria={criteria} onChange={updateCriteria} onSubmit={handleSearch} />

      <FeaturedProperties
        properties={visibleProperties}
        isSearchResult={isSearching}
        onClearSearch={reset}
      />

      <AboutSection />

      <ServicesCarousel />

      <WhyChooseUs />

      <PropertyTypes />

      <FeaturedDevelopment />

      <HowItWorks />

      <LocationsSection />

      <Testimonials />

      <BlogPreview />

      <CTASection />
    </main>
  )
}
