import { useRentFeatured } from '@/features/rent/hooks/useRentFeatured'
import { RENT_FEATURED_LIMIT } from '@/features/rent/services/rentService'
import { buildRentPropertiesHref } from '@/features/rent/utils/rentQuery'
import { PropertyErrorState } from '@/components/properties/PropertyErrorState'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PropertyGridSkeleton } from '@/components/properties/PropertySkeleton'
import { useFavourites } from '@/shared/hooks/useFavourites'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'

/**
 * The featured rental grid.
 *
 * Renders the exact query the route preloaded (`FEATURED_RENT_FILTERS`, newest
 * first, six per page), so the grid paints from cache rather than flashing
 * skeletons after a normal visit. The cards are the shared catalogue components
 * — same photographs, same "For Rent" badge, same favourites, same detail links.
 */
export function RentFeaturedProperties() {
  const { status, results, error, retry, isStale } = useRentFeatured()
  const { isFavourite, toggleFavourite } = useFavourites()

  const viewAllHref = buildRentPropertiesHref({})

  return (
    <Section tone="warm" ariaLabelledBy="rent-featured-heading">
      <Container>
        <SectionHeading
          id="rent-featured-heading"
          eyebrow="Featured rentals"
          title="Featured Properties For Rent"
          description="A rotating handful of the rentals our team is showing most often right now — a sample of what is available."
          action={
            <ArrowLink href={viewAllHref} size="md">
              View all rentals
            </ArrowLink>
          }
        />

        <div className="mt-12">
          {status === 'loading' ? (
            <PropertyGridSkeleton count={RENT_FEATURED_LIMIT} />
          ) : status === 'error' ? (
            <PropertyErrorState message={error ?? undefined} onRetry={retry} />
          ) : results && results.items.length > 0 ? (
            <>
              <PropertyGrid
                properties={results.items}
                isFavourite={isFavourite}
                onToggleFavourite={toggleFavourite}
                label="Featured properties for rent"
              />
              {isStale && (
                <p aria-live="polite" className="mt-4 text-center text-xs italic text-ink-400">
                  Refreshing…
                </p>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-sand-300 bg-white p-10 text-center shadow-sm">
              <h3 className="font-display text-xl text-ink-900">No rentals to show right now</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
                Our demo catalogue has no rental listings at the moment. Browse the full catalogue
                instead.
              </p>
              <ArrowLink href={viewAllHref} size="md" className="mt-5 justify-center">
                View all rentals
              </ArrowLink>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
