import { getSearchableLocations } from '@/data'
import { purposeOptions } from '@/data/searchOptions'
import type { PropertyFiltersController } from '@/shared/types/propertyFiltersController'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'
import type { PropertyPurpose } from '@/types'

interface PropertySearchBarProps {
  controller: PropertyFiltersController
  /** Fired on submit — brings results into view. */
  onSearch: () => void
  /** Fired when clicking the filter button — triggers the mobile filter drawer or scrolls to the sidebar. */
  onOpenFilters?: () => void
  className?: string
}

/**
 * Minimal, hero-style pill search tool for the properties catalogue:
 * - Floating purpose chips (Buy / Rent)
 * - Streamlined pill input with location query, filter toggle triggering the sidebar/drawer, and search button
 * - Live location auto-complete suggestions
 */
export function PropertySearchBar({
  controller,
  onSearch,
  onOpenFilters,
  className,
}: PropertySearchBarProps) {
  const { filters, activeCount } = controller
  const purpose = (filters.purpose === 'any' ? 'buy' : filters.purpose) as PropertyPurpose

  const locations = getSearchableLocations()

  const filteredLocations = filters.query
    ? locations.filter((loc) => loc.name.toLowerCase().includes(filters.query.toLowerCase()))
    : locations

  return (
    <SearchFilterPill<PropertyPurpose>
      value={filters.query}
      onChange={(value) => controller.setQuery(value)}
      onSubmit={onSearch}
      purpose={purpose}
      purposeOptions={purposeOptions}
      onPurposeChange={(nextPurpose) => controller.setPurpose(nextPurpose)}
      activeFilterCount={activeCount}
      onFilterToggle={onOpenFilters}
      placeholder="Search by location (e.g. Lekki, Ikoyi)..."
      ariaLabel="Search properties"
      filterAriaLabel="Open property filters"
      suggestions={filteredLocations.slice(0, 6).map((loc) => ({
        id: loc.id,
        label: loc.name,
      }))}
      onSelectSuggestion={(item) => {
        controller.setQuery(item.label)
        onSearch()
      }}
      className={className}
    />
  )
}
