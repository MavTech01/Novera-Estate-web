import { AboutSection } from '../components/about/AboutSection'
import { BlogPreview } from '../components/blog/BlogPreview'
import { CTASection } from '../components/cta/CTASection'
import { FeaturedDevelopment } from '../components/development/FeaturedDevelopment'
import { HeroSearchOverlay } from '../components/hero/HeroSearchOverlay'
import { HeroSection } from '../components/hero/HeroSection'
import { LocationsSection } from '../components/locations/LocationsSection'
import { Navbar } from '../components/navigation/Navbar'
import { HowItWorks } from '../components/process/HowItWorks'
import { FeaturedProperties } from '../components/properties/FeaturedProperties'
import { PropertyTypes } from '../components/property-types/PropertyTypes'
import { ServicesCarousel } from '../components/services/ServicesCarousel'
import { Testimonials } from '../components/testimonials/Testimonials'
import { WhyChooseUs } from '../components/trust/WhyChooseUs'
import { getFeaturedProperties } from '../data'
import { usePropertySearch } from '../hooks/usePropertySearch'

/** Landing page — composes every homepage section in order. */
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
    <>
      <Navbar />

      <main id="main-content">
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
    </>
  )
}
