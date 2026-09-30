import { useFavourites } from '../../hooks/useFavourites'
import type { Property } from '../../types'
import { ArrowLink } from '../ui/ArrowLink'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { PropertyCard } from './PropertyCard'
import { SearchResultSummary } from './SearchResultSummary'

interface FeaturedPropertiesProps {
  properties: Property[]
  /** Switches the header to search-result mode. */
  isSearchResult?: boolean
  onClearSearch?: () => void
}

/** Three-across listing grid. Doubles as the results panel for the hero search. */
export function FeaturedProperties({
  properties,
  isSearchResult = false,
  onClearSearch,
}: FeaturedPropertiesProps) {
  const { isFavourite, toggleFavourite } = useFavourites()

  return (
    <Section id="properties" tone="white" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow={isSearchResult ? 'Search results' : 'Our listings'}
          title={isSearchResult ? 'Matching Properties' : 'Our Premier Selection'}
          description="Explore some of our latest and most sought-after properties."
          action={
            isSearchResult ? undefined : (
              <ArrowLink href="/properties" size="md">
                View All Properties
              </ArrowLink>
            )
          }
        />

        {isSearchResult && <SearchResultSummary count={properties.length} onClear={onClearSearch} />}

        {properties.length > 0 ? (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {properties.map((property, index) => (
              <Reveal as="li" key={property.id} delay={(index % 3) * 90} className="flex">
                <PropertyCard
                  property={property}
                  isFavourite={isFavourite(property.id)}
                  onToggleFavourite={() => toggleFavourite(property.id)}
                />
              </Reveal>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-sand-300 bg-tint-50 p-10 text-center">
            <h3 className="font-display text-xl text-ink-900">No properties match that search</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
              Try widening your budget, choosing a different location, or browsing all of our listings.
            </p>
            {onClearSearch && (
              <button
                type="button"
                onClick={onClearSearch}
                className="mt-5 min-h-11 text-sm font-semibold text-accent-700 underline underline-offset-4 hover:text-accent-600"
              >
                Clear search filters
              </button>
            )}
          </div>
        )}
      </Container>
    </Section>
  )
}
