/**
 * Public surface of the Locations feature.
 *
 * Pages import from here rather than reaching into `components/`, `data/` or
 * `hooks/` directly, which keeps the feature's internals free to move. The
 * Projects feature does the same, so a consumer that needs both imports from two
 * feature entry points and nothing else.
 */

export { DevelopmentsByLocation } from './components/DevelopmentsByLocation'
export { FeaturedLocation, FeaturedLocationSkeleton } from './components/FeaturedLocation'
export { LocationActiveFilters } from './components/LocationActiveFilters'
export { LocationCard } from './components/LocationCard'
export { LocationCategoryFilter } from './components/LocationCategoryFilter'
export { LocationComparison } from './components/LocationComparison'
export { LocationDemoNotice } from './components/LocationDemoNotice'
export { LocationEmptyState } from './components/LocationEmptyState'
export { LocationErrorState } from './components/LocationErrorState'
export { LocationGrid } from './components/LocationGrid'
export {
  LocationCardSkeleton,
  LocationGridSkeleton,
  LocationsPageSkeleton,
} from './components/LocationCardSkeleton'
export { LocationHero } from './components/LocationHero'
export { LocationHighlights } from './components/LocationHighlights'
export { LocationMap } from './components/LocationMap'
export { LocationSearch } from './components/LocationSearch'
export { LocationsClosingCta } from './components/LocationsClosingCta'
export { PropertiesByLocation } from './components/PropertiesByLocation'
export { WhyLocationMatters } from './components/WhyLocationMatters'

export {
  useLocationResource,
  type LocationRequestStatus,
  type LocationResource,
} from './hooks/useLocationResource'
export {
  useAllLocations,
  useFeaturedLocation,
  useLocation,
  useLocationComparison,
  useLocations,
} from './hooks/useLocations'
export {
  useLocationSearch,
  type LocationSearchController,
} from './hooks/useLocationSearch'

export { getLocationBySlug, getLocations } from './services/locationService'

export {
  formatProjectCount,
  formatPropertyCount,
  locationCtaLabel,
} from './utils/locationUtils'

export type {
  ActiveLocationFilter,
  Location,
  LocationCategoryValue,
  LocationCategoryId,
  LocationCategoryOption,
  LocationComparisonAttribute,
  LocationComparisonTable,
  LocationFactor,
  LocationFilters,
  LocationHighlight,
  LocationLandmark,
} from './types/locationTypes'
