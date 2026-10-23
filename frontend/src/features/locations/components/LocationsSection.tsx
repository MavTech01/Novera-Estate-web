import { useState } from 'react'
import { getFeaturedLocations } from '@/data'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import {
  LocationInteractiveMap,
  LocationSummaryCard,
  LOCATION_MAP_METADATA,
  DEFAULT_LOCATION_MAP_METADATA,
} from './explorer'

/**
 * "Explore Prime Locations" section on the home page.
 * Features an interactive light-mode map of Lagos and a synchronized estate preview card.
 */
export function LocationsSection() {
  const locations = getFeaturedLocations()
  const [activeSlug, setActiveSlug] = useState<string>(locations[0]?.slug ?? 'lekki-phase-1')

  const activeLocation = locations.find((loc) => loc.slug === activeSlug) ?? locations[0]
  const activeMeta =
    LOCATION_MAP_METADATA[activeLocation.slug] ?? DEFAULT_LOCATION_MAP_METADATA

  return (
    <Section id="locations" tone="white" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Prime locations"
          title="Explore Prime Locations"
          description="Explore our interactive coverage map showing the prime neighbourhoods where Novera Estates develops and curates luxury properties."
          action={
            <ArrowLink href="/locations" size="md">
              All locations catalogue
            </ArrowLink>
          }
        />

        {/* Side-by-Side Desktop Layout (Interactive Map on Left, Location Summary Card on Right) */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-8">
          <LocationInteractiveMap
            locations={locations}
            activeSlug={activeSlug}
            onSelectLocation={setActiveSlug}
          />

          <LocationSummaryCard
            location={activeLocation}
            metadata={activeMeta}
          />
        </div>
      </Container>
    </Section>
  )
}
