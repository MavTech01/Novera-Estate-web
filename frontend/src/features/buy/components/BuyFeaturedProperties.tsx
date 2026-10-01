import { useBuyFeatured } from '@/features/buy/hooks/useBuyFeatured'
import { routes } from '@/shared/lib/routes'
import { BUY_FEATURED_LIMIT } from '@/features/buy/services/buyService'
import { PropertyErrorState } from '@/components/properties/PropertyErrorState'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PropertyGridSkeleton } from '@/components/properties/PropertySkeleton'
import { useFavourites } from '@/shared/hooks/useFavourites'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'

/**
 * The six featured sale listings.
 *
 * Renders the exact query the route preloaded (`FEATURED_BUY_FILTERS`, newest
 * first, six per page), so the grid paints from cache rather than flashing
 * skeletons after a normal visit. The cards themselves are the shared
 * catalogue components — same pricing, same favourites, same detail links.
 */
export function BuyFeaturedProperties() {
  const { status, results, error, retry, isStale } = useBuyFeatured()
  const { isFavourite, toggleFavourite } = useFavourites()

  return (
    <Section tone="warm" ariaLabelledBy="buy-featured-heading">
      <Container>
        <SectionHeading
          id="buy-featured-heading"
          eyebrow="Featured sales"
          title="Properties People Are Buying Right Now"
          description="A rotating handful of sale listings our team is showing most often this month."
          action={
            <ArrowLink href={routes.properties} size="md">
              Browse all for sale
            </ArrowLink>
          }
        />

        <div className="mt-12">
          {status === 'loading' ? (
            <PropertyGridSkeleton count={BUY_FEATURED_LIMIT} />
          ) : status === 'error' ? (
            <PropertyErrorState message={error ?? undefined} onRetry={retry} />
          ) : results && results.items.length > 0 ? (
            <>
              <PropertyGrid
                properties={results.items}
                isFavourite={isFavourite}
                onToggleFavourite={toggleFavourite}
                label="Featured properties for sale"
              />
              {isStale && (
                <p aria-live="polite" className="mt-4 text-center text-xs italic text-ink-400">
                  Refreshing…
                </p>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-sand-300 bg-white p-10 text-center shadow-sm">
              <h3 className="font-display text-xl text-ink-900">No featured sales right now</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
                Our demo catalogue has no featured sale listings at the moment. Browse the full
                selection instead.
              </p>
              <ArrowLink href={routes.properties} size="md" className="mt-5 justify-center">
                View all for-sale properties
              </ArrowLink>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}