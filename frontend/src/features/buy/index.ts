/**
 * Public surface of the Buy feature.
 *
 * The page in `pages/Buy` and `routeManifest` import from here, so the internals
 * of the feature — its hooks, service and editorial data — can be reorganised
 * without any change outside this folder.
 */

export { BuyHero } from './components/BuyHero'
export { BuySearchPanel } from './components/BuySearchPanel'
export { BuyDemoNotice } from './components/BuyDemoNotice'
export { BuyCategories } from './components/BuyCategories'
export { BuyFeaturedProperties } from './components/BuyFeaturedProperties'
export { BuyLocations } from './components/BuyLocations'
export { BuyingProcess } from './components/BuyingProcess'
export { BuyerGuidance } from './components/BuyerGuidance'
export { BuySavedPropertiesCta } from './components/BuySavedPropertiesCta'
export { BuyFaq } from './components/BuyFaq'
export { BuyInspectionCta } from './components/BuyInspectionCta'
export { BuyFinalCta } from './components/BuyFinalCta'
export { BuySkeleton } from './components/BuySkeleton'
export { BuyErrorState } from './components/BuyErrorState'

export { useBuyCatalogue } from './hooks/useBuyCatalogue'
export { useBuyFeatured } from './hooks/useBuyFeatured'
export { useBuySearch } from './hooks/useBuySearch'

export {
  BUY_FEATURED_LIMIT,
  BUY_HERO_IMAGE,
  FEATURED_BUY_FILTERS,
  getBuyCatalogue,
  readBuyCatalogue,
  preloadBuyCatalogue,
  getFeaturedBuyProperties,
  readFeaturedBuyProperties,
  preloadFeaturedBuyProperties,
} from './services/buyService'

export {
  buyCategorySeeds,
  buyFaq,
  buyerGuidance,
  buyPropertyTypes,
  buyingProcessSteps,
} from './data/buyData'

export {
  ANY_FILTER,
  buildBuyCategoryHref,
  buildBuyLocationHref,
  buildBuyPropertiesHref,
  buildBuySearchHref,
  emptyBuySearch,
  findBuySearchProblem,
  hasBuySearch,
  parseBuySearch,
  serialiseBuySearch,
  toPropertyFilters,
} from './utils/buyQuery'

export type {
  BuyCategory,
  BuyCatalogue,
  BuyFaqItem,
  BuyLocation,
  BuyRequestStatus,
  BuyResource,
  BuySearchController,
  BuySearchCriteria,
  BuyerGuidanceCard,
  BuyingProcessStep,
} from './types/buy.types'