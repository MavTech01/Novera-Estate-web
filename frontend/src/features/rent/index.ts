/**
 * Public surface of the Rent feature.
 *
 * The page in `pages/Rent` and `routeManifest` import from here, so the internals
 * of the feature — its hooks, service and editorial data — can be reorganised
 * without any change outside this folder.
 */

export { RentSearchPanel } from './components/RentSearchPanel'
export { RentDemoNotice } from './components/RentDemoNotice'
export { RentCategories } from './components/RentCategories'
export { RentFeaturedProperties } from './components/RentFeaturedProperties'
export { RentLocations } from './components/RentLocations'
export { RentalProcess } from './components/RentalProcess'
export { RentalGuidance } from './components/RentalGuidance'
export { RentSavedPropertiesCta } from './components/RentSavedPropertiesCta'
export { RentFaq } from './components/RentFaq'
export { RentFinalCta } from './components/RentFinalCta'
export { RentSkeleton } from './components/RentSkeleton'
export { RentErrorState } from './components/RentErrorState'

export { useRentCatalogue } from './hooks/useRentCatalogue'
export { useRentFeatured } from './hooks/useRentFeatured'
export { useRentSearch } from './hooks/useRentSearch'

export {
  FEATURED_RENT_FILTERS,
  RENT_FEATURED_LIMIT,
  RENT_HERO_IMAGE,
  getRentCatalogue,
  readRentCatalogue,
  preloadRentCatalogue,
  getFeaturedRentProperties,
  readFeaturedRentProperties,
  preloadFeaturedRentProperties,
} from './services/rentService'

export {
  rentCategorySeeds,
  rentFaq,
  rentHeroHighlights,
  rentPropertyTypes,
  rentalGuidance,
  rentalProcessSteps,
} from './data/rentData'

export {
  ANY_FILTER,
  buildRentCategoryHref,
  buildRentLocationHref,
  buildRentPropertiesHref,
  buildRentSearchHref,
  emptyRentSearch,
  findRentSearchProblem,
  hasRentSearch,
  parseRentSearch,
  serialiseRentSearch,
  toPropertyFilters,
} from './utils/rentQuery'

export type {
  RentCategory,
  RentCatalogue,
  RentFaqItem,
  RentLocation,
  RentRequestStatus,
  RentResource,
  RentSearchController,
  RentSearchCriteria,
  RentalGuidanceCard,
  RentalProcessStep,
} from './types/rent.types'
