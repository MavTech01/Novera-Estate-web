import { useListingSearch } from '@/shared/hooks/useListingSearch'
import type {
  BuyLocation,
  BuySearchController,
} from '@/features/buy/types/buy.types'

/**
 * Owns the Buy page search panel's criteria and keeps the URL in sync.
 *
 * The address bar is the shareable form of the visitor's search, the same way it
 * is on `/properties`: `useSearchParams` is reactive, so a shared
 * `/buy?location=lekki&bedrooms=4` link and the browser back button are the same
 * event as a change in the panel. Nothing mirrors the criteria into component
 * state.
 *
 * Changes are written with `replace`, so a tweak never floods the back button.
 *
 * One deliberate wrinkle: the area list arrives asynchronously from the
 * catalogue, and an area is only recognisable by the catalogue slugs behind it.
 * So the panel does not touch the URL until the areas are known — otherwise it
 * would overwrite a deep link with an empty search before the areas loaded.
 *
 * The mechanics are the Rent panel's too, so they live in `useListingSearch`;
 * what makes this Buy is the two things that differ: the listing purpose a
 * submission targets, and the word this page uses for money.
 */
export function useBuySearch(areas: readonly BuyLocation[]): BuySearchController {
  return useListingSearch({ areas, purpose: 'buy', priceNoun: 'price' })
}
