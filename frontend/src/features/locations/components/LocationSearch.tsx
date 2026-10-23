import { locationCategoryOptions } from '@/features/locations/data/locationOptions'
import type { LocationSearchController } from '@/features/locations/hooks/useLocationSearch'
import type { LocationCategoryValue } from '@/features/locations/types/locationTypes'
import { Icon } from '@/shared/components/ui/Icon'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'

interface LocationSearchProps {
  controller: LocationSearchController
  suggestions?: { slug: string; name: string }[]
  onSearch?: () => void
  className?: string
}

/**
 * The hero search field for Locations — minimal pill style.
 *
 * Uses `SearchFilterPill` with autocomplete suggestions and a filter popover
 * for location categories (Island, Mainland, etc.).
 */
export function LocationSearch({
  controller,
  suggestions = [],
  onSearch,
  className,
}: LocationSearchProps) {
  const { filters, setQuery, setCategory, reset, hasQuery } = controller

  const isCategoryFiltered = filters.category !== 'all'

  const filterContent = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Filter by Zone</h3>
        {isCategoryFiltered && (
          <button
            type="button"
            onClick={() => setCategory('all')}
            className="text-xs font-medium text-accent-600 transition-colors hover:text-accent-800"
          >
            Clear filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {locationCategoryOptions.map((cat) => {
          const isSelected = filters.category === cat.value
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value as LocationCategoryValue)}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-accent-600 bg-accent-50 text-accent-700'
                  : 'border-sand-200 bg-white text-ink-700 hover:border-accent-300 hover:bg-tint-50'
              }`}
            >
              <Icon
                name={cat.icon}
                className={`size-4 shrink-0 ${isSelected ? 'text-accent-600' : 'text-ink-400'}`}
                strokeWidth={2}
              />
              <span className="truncate">{cat.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )

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
      filterAriaLabel="Toggle zone filter"
      showClear={hasQuery}
      onClear={reset}
      activeFilterCount={isCategoryFiltered ? 1 : 0}
      filterContent={filterContent}
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
