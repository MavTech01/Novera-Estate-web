import {
  RentCategories,
  RentDemoNotice,
  RentErrorState,
  RentFaq,
  RentFeaturedProperties,
  RentFinalCta,
  RentInspectionCta,
  RentLocations,
  RentSavedPropertiesCta,
  RentSearchPanel,
  RentSkeleton,
  RentalGuidance,
  RentalProcess,
  RENT_HERO_IMAGE,
  rentFaq,
  rentHeroHighlights,
  rentalGuidance,
  rentalProcessSteps,
  useRentCatalogue,
} from '@/features/rent'
import { PageHero } from '@/shared/components/layout/PageHero'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import { routes } from '@/shared/lib/routes'

/**
 * Rent page — the guided way into the rental catalogue.
 *
 * Deliberately thin, mirroring `BuyPage`: `rentService` owns the request,
 * `useRentCatalogue` owns the lifecycle, and this file decides only which
 * sections render for which state.
 *
 * What the page is *not* is a second inventory. Every card, count, rent and
 * listing here comes from the shared properties catalogue and the Locations
 * mapping, requested with `purpose=rent`, so a card can never disagree with the
 * results behind its link. Its job is to make renting legible — what to rent, in
 * which area, at what budget, and what happens next — and then hand the visitor
 * to the catalogue.
 *
 * Tones alternate so consecutive sections never blend: warm hero → white search
 * panel over the hero's edge → white categories → warm featured → white
 * locations → warm process → white guidance → white saved-properties → tint FAQ
 * → brown inspection band → white closing band.
 */
export function RentPage() {
  const { value: catalogue, status, error, retry } = useRentCatalogue()

  if (status === 'error') {
    return (
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <RentErrorState
          message={error ?? 'Something went wrong while loading the rental catalogue.'}
          onRetry={retry}
        />
      </main>
    )
  }

  if (status === 'loading') {
    return (
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <RentSkeleton />
      </main>
    )
  }

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <PageHero
        eyebrow="Rent property in Lagos"
        title="Find a Place to Rent That Feels Like Home."
        description="Browse apartments, houses, luxury residences and commercial spaces to let across Lekki, Ikoyi, Ikeja and beyond — then let our team help you through the viewings, the terms and the move."
        image={RENT_HERO_IMAGE}
        breadcrumbs={pageCrumbs({ label: 'Rent' })}
        actions={[
          { label: 'Find a Rental', href: '#rent-search', withArrow: true },
          {
            label: 'Book an Inspection',
            href: routes.bookInspection,
            variant: 'outline',
            icon: 'calendar-search',
          },
        ]}
        trust={rentHeroHighlights}
      />

      {/* Pulls up over the hero's lower edge, the way the listing page's search bar does. */}
      <RentSearchPanel areas={catalogue.locations} />

      <RentDemoNotice />

      <RentCategories categories={catalogue.categories} />

      <RentFeaturedProperties />

      <RentLocations locations={catalogue.locations} />

      <RentalProcess steps={rentalProcessSteps} />

      <RentalGuidance cards={rentalGuidance} />

      <RentSavedPropertiesCta />

      <RentFaq items={rentFaq} />

      <RentInspectionCta />

      <RentFinalCta />
    </main>
  )
}
