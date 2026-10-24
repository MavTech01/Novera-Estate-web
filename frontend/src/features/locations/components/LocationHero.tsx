import { images } from '@/assets/images'
import { company } from '@/data/company'
import { PageHero, type PageHeroTrustItem } from '@/shared/components/layout/PageHero'
import { Container } from '@/shared/components/ui/Container'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import type { LocationSearchController } from '@/features/locations/hooks/useLocationSearch'
import { LocationSearch } from './LocationSearch'

interface LocationHeroProps {
  controller: LocationSearchController
  /** Names offered as one-tap suggestions under the search field. */
  suggestions: { slug: string; name: string }[]
  /** Called when the search form is submitted, to bring the results into view. */
  onSearch: () => void
  /** Fired when clicking the filter button inside the search pill — opens the filter bottom sheet / drawer. */
  onOpenFilters?: () => void
  /** Fill of the closing wave — match whichever section follows the hero. */
  wave?: 'white' | 'cream'
}

const locationTrust: readonly PageHeroTrustItem[] = [
  { id: 'inspected', icon: 'shield-check', label: 'Inspected before you view' },
  { id: 'visits', icon: 'calendar-search', label: 'Site visits available' },
  { id: 'areas', icon: 'map-pinned', label: 'Six areas across Lagos' },
]

/**
 * Locations page hero: the promise over a Lagos photograph, with the search
 * tool pulled up beneath so it reads as part of the banner rather than as a
 * separate widget.
 *
 * Kept deliberately short. The hero's job is to orient and to hand the visitor
 * to the search; the catalogue is the page, not the banner. The panel is a
 * sibling so it can overlap the banner's wave cleanly.
 */
export function LocationHero({ controller, suggestions, onSearch, onOpenFilters, wave }: LocationHeroProps) {
  return (
    <>
      <PageHero
        headingId="locations-hero-heading"
        eyebrow={company.descriptor}
        title="Find Your Place in Lagos"
        description="Discover properties and developments across some of Lagos's most sought-after areas."
        image={{
          src: images.hero.main,
          alt: 'Aerial view of Lagos showing residential districts, roads and the coastline',
        }}
        breadcrumbs={pageCrumbs({ label: 'Locations' })}
        trust={locationTrust}
        wave={wave}
      />

      {/*
        Sits over the banner's wave, matching the Properties, Buy, Rent, and Projects minimal pill pattern.
      */}
      <div className="relative z-20 pt-6 sm:pt-8 lg:pt-10">
        <Container className="max-w-2xl">
          <LocationSearch
            controller={controller}
            suggestions={suggestions}
            onSearch={onSearch}
            onOpenFilters={onOpenFilters}
          />
        </Container>
      </div>
    </>
  )
}
