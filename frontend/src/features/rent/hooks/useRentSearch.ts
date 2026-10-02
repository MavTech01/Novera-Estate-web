import { useListingSearch } from '@/shared/hooks/useListingSearch'
import type {
  RentLocation,
  RentSearchController,
} from '@/features/rent/types/rent.types'

/**
 * Owns the Rent page search panel's criteria and keeps the URL in sync.
 *
 * The address bar is the shareable form of the visitor's search, the same way it
 * is on `/properties`: `useSearchParams` is reactive, so a shared
 * `/rent?location=lekki&bedrooms=4` link and the browser back button are the same
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
 * The mechanics are the Buy panel's too, so they live in `useListingSearch`;
 * what makes this Rent is the two things that differ: the listing purpose a
 * submission targets, and the word this page uses for money.
 */
export function useRentSearch(areas: readonly RentLocation[]): RentSearchController {
  return useListingSearch({ areas, purpose: 'rent', priceNoun: 'rent' })
}
