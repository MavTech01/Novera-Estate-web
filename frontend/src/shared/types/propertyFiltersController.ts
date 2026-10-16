import type { PriceBand } from '@/data/searchOptions'
import type {
  ActiveFilter,
  ListingStatusFilter,
  PropertyFilters,
  PropertyPurpose,
  PropertySort,
  PropertyTag,
  PropertyType,
} from '@/types'

export interface PropertyFiltersController {
  filters: PropertyFilters
  sort: PropertySort
  page: number
  /** Number of individual filters applied — drives the "Filters (n)" badge. */
  activeCount: number
  /** Removable summary of every applied filter. */
  activeFilters: ActiveFilter[]
  /** Price band options for the current purpose, including any ad-hoc range. */
  priceBands: PriceBand[]
  /** Value of the price select for the current range. */
  priceBandValue: string
  isFiltered: boolean
  setPurpose: (purpose: PropertyPurpose | 'any') => void
  setQuery: (query: string) => void
  setLocation: (slug: string) => void
  toggleLocation: (slug: string) => void
  /** Replaces the whole multi-select — used by the single-value search bar select. */
  setPropertyType: (type: PropertyType | null) => void
  togglePropertyType: (type: PropertyType) => void
  toggleStatus: (status: ListingStatusFilter) => void
  toggleTag: (tag: PropertyTag) => void
  setMinBedrooms: (bedrooms: number | null) => void
  setMinBathrooms: (bathrooms: number | null) => void
  /** Applies a preset band, or explicit bounds when `band` is null. */
  setPriceBand: (band: PriceBand | null) => void
  removeFilter: (chip: ActiveFilter) => void
  setSort: (sort: PropertySort) => void
  setPage: (page: number) => void
  reset: () => void
}