import {
  BuyCategories,
  BuyErrorState,
  BuyFaq,
  BuyFeaturedProperties,
  BuyFinalCta,
  BuyLocations,
  BuySavedPropertiesCta,
  BuySearchPanel,
  BuySkeleton,
  BuyerGuidance,
  BuyingProcess,
  BUY_HERO_IMAGE,
  buyFaq,
  buyHeroHighlights,
  buyerGuidance,
  buyingProcessSteps,
  useBuyCatalogue,
} from '@/features/buy'
import { PageHero } from '@/shared/components/layout/PageHero'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'
import { routes } from '@/shared/lib/routes'
/**
 * Buy page — the guided way into the for-sale catalogue.
 *
 * Deliberately thin, mirroring `AboutPage` and `LocationsPage`: `buyService`
 * owns the request, `useBuyCatalogue` owns the lifecycle, and this file decides
 * only which sections render for which state.
 *
 * What the page is *not* is a second inventory. Every card, count, price and
 * listing here comes from the shared properties catalogue and the Locations
 * mapping, requested with `purpose=buy`, so a card can never disagree with the
 * results behind its link. Its job is to make buying legible — what to buy, in
 * which area, on what budget, and what happens next — and then hand the visitor
 * to the catalogue.
 *
 * Tones alternate so consecutive sections never blend: warm hero → white search
 * panel over the hero's edge → white categories → warm featured → white
 * locations → warm process → white guidance → white saved-properties → tint FAQ
 * → brown inspection band → white closing band.
 */
export function BuyPage() {
  const { value: catalogue, status, error, retry } = useBuyCatalogue()

  if (status === 'error') {
    return (
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <BuyErrorState
          message={error ?? 'Something went wrong while loading the buying catalogue.'}
          onRetry={retry}
        />
      </main>
    )
  }

  if (status === 'loading') {
    return (
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <BuySkeleton />
      </main>
    )
  }

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <PageHero
        eyebrow="Buy property in Lagos"
        title="Find a Property Worth Coming Home To."
        description="Browse homes, apartments, land and development opportunities across Lekki, Ikoyi, Ikeja and beyond — then let our team guide you through every step, from first viewing to handover."
        image={BUY_HERO_IMAGE}
        breadcrumbs={pageCrumbs({ label: 'Buy' })}
        actions={[
          { label: 'Start Your Search', href: '#buy-search', withArrow: true },
          {
            label: 'Book an Inspection',
            href: routes.bookInspection,
            variant: 'outline',
            icon: 'calendar-search',
          },
        ]}
        trust={buyHeroHighlights}
      />

      {/* Pulls up over the hero's lower edge, the way the listing page's search bar does. */}
      <BuySearchPanel areas={catalogue.locations} />

      <BuyCategories categories={catalogue.categories} />

      <BuyFeaturedProperties />

      <BuyLocations locations={catalogue.locations} />

      <BuyingProcess steps={buyingProcessSteps} />

      <BuyerGuidance cards={buyerGuidance} />

      <BuySavedPropertiesCta />

      <BuyFaq items={buyFaq} />

      <BuyFinalCta />
    </main>
  )
}