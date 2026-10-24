import type { LocationSearchController } from '@/features/locations/hooks/useLocationSearch'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'

interface LocationSearchProps {
  controller: LocationSearchController
  suggestions?: { slug: string; name: string }[]
  onSearch?: () => void
  /** Fired when clicking the filter button inside the pill — opens the filter bottom sheet / drawer. */
  onOpenFilters?: () => void
  className?: string
}

/**
 * The hero search field for Locations — minimal pill style.
 *
 * Uses `SearchFilterPill` with autocomplete suggestions and wires the filter
 * trigger button directly to the universal locations filter sheet / drawer.
 */
export function LocationSearch({
  controller,
  suggestions = [],
  onSearch,
  onOpenFilters,
  className,
}: LocationSearchProps) {
  const { filters, setQuery, reset, hasQuery } = controller

  const isCategoryFiltered = filters.category !== 'all'

  const suggestionItems = suggestions
    .filter((s) =>
      filters.query ? s.name.toLowerCase().includes(filters.query.toLowerCase()) : true,
    )
    .slice(0, 6)
    .map((s) => ({
      id: s.slug,
      label: s.name,
    }))

  return (
    <SearchFilterPill
      id="locations-search"
      value={filters.query}
      onChange={setQuery}
      onSubmit={() => onSearch?.()}
      placeholder="Search by location (e.g. Lekki, Ikoyi)..."
      ariaLabel="Search locations"
      filterAriaLabel="Open location filters"
      showClear={hasQuery}
      onClear={reset}
      activeFilterCount={isCategoryFiltered ? 1 : 0}
      onFilterToggle={onOpenFilters}
      suggestions={filters.query ? suggestionItems : []}
      onSelectSuggestion={(item) => {
        setQuery(item.label)
        onSearch?.()
      }}
      noSuggestionsText={
        filters.query.trim().length > 0 ? `No areas match "${filters.query}"` : undefined
      }
      className={className}
    />
  )
}
