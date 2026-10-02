import { usePropertyListing } from '@/features/properties/hooks/usePropertyListing'
import {
  FEATURED_RENT_FILTERS,
  RENT_FEATURED_LIMIT,
} from '@/features/rent/services/rentService'

/**
 * The featured rental grid on the Rent page.
 *
 * Deliberately a thin wrapper over the properties feature's own listing hook:
 * the grid renders the shared `PropertyCard` and its links land on
 * `/properties`, so the request lifecycle should be the properties feature
 * speaking its own dialect, not a second reimplementation of it.
 *
 * The filters come from `rentService`, so the preloader, this hook and the URL
 * always describe the same query.
 */
export function useRentFeatured() {
  return usePropertyListing({
    filters: FEATURED_RENT_FILTERS,
    sort: 'newest',
    page: 1,
    perPage: RENT_FEATURED_LIMIT,
  })
}
