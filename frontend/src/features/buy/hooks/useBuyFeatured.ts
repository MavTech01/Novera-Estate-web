import { usePropertyListing } from '@/features/properties/hooks/usePropertyListing'
import {
  BUY_FEATURED_LIMIT,
  FEATURED_BUY_FILTERS,
} from '@/features/buy/services/buyService'

/**
 * The featured sale grid on the Buy page.
 *
 * Deliberately a thin wrapper over the properties feature's own listing hook:
 * the grid renders the shared `PropertyCard` and its links land on `/properties`,
 * so the request lifecycle should be the properties feature speaking its own
 * dialect, not a second reimplementation of it.
 *
 * The filters come from `buyService`, so the preloader, this hook and the URL
 * always describe the same query.
 */
export function useBuyFeatured() {
  return usePropertyListing({
    filters: FEATURED_BUY_FILTERS,
    sort: 'newest',
    page: 1,
    perPage: BUY_FEATURED_LIMIT,
  })
}