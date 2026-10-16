import { propertyTypeFilterOptions } from '@/data/propertyFilters'
import { purposeOptions } from '@/data/searchOptions'
import type { PropertyFiltersController } from '@/shared/types/propertyFiltersController'
import { cn } from '@/shared/lib/cn'
import type { PropertyPurpose, PropertyType } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextField } from '@/shared/components/ui/TextField'
import { PropertyPriceRangeSelect } from './PropertyPriceRangeSelect'

interface PropertySearchBarProps {
  controller: PropertyFiltersController
  /** Fired on submit — closes the mobile drawer and brings results into view. */
  onSearch: () => void
  className?: string
}

const bedroomQuickOptions = [
  { value: 'any', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
]

/**
 * The page's primary search tool: purpose, location keyword, type, price and
 * bedroom count in one horizontal band on desktop, stacked on mobile.
 *
 * Values are live — results update as the visitor edits — while submit (click
 * or Enter) exists so keyboard users and the mobile drawer still get an
 * explicit "show me the results" step.
 */
export function PropertySearchBar({ controller, onSearch, className }: PropertySearchBarProps) {
  const { filters, priceBands, priceBandValue } = controller
  const purpose = filters.purpose === 'any' ? 'buy' : filters.purpose

  return (
    <div className={cn('animate-rise-in', className)}>
      <form
        role="search"
        aria-label="Search properties"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
        className="rounded-2xl border border-sand-200 bg-white p-5 shadow-xl sm:p-6"
      >
        <SegmentedControl
          label="Purpose"
          value={purpose}
          options={purposeOptions}
          onChange={(value: PropertyPurpose) => controller.setPurpose(value)}
          className="w-full sm:w-fit"
        />

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-sand-200 pt-5 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-3">
          <TextField
            id="properties-search-location"
            label="Location"
            value={filters.query}
            onChange={controller.setQuery}
            placeholder="Search location"
            className="sm:col-span-2 lg:col-span-4"
          />

          <SelectField
            id="properties-search-type"
            label="Property Type"
            value={filters.propertyType[0] ?? 'any'}
            options={[
              { value: 'any', label: 'All Types' },
              ...propertyTypeFilterOptions.map((option) => ({ value: option.value, label: option.label })),
            ]}
            onChange={(value) => controller.setPropertyType(value === 'any' ? null : (value as PropertyType))}
            className="lg:col-span-2"
          />

          <PropertyPriceRangeSelect
            id="properties-search-price"
            purpose={purpose}
            bands={priceBands}
            value={priceBandValue}
            customRange={{ min: filters.minPrice, max: filters.maxPrice }}
            onChange={controller.setPriceBand}
            className="lg:col-span-2"
          />

          <SelectField
            id="properties-search-bedrooms"
            label="Bedrooms"
            value={filters.bedrooms === null ? 'any' : String(filters.bedrooms)}
            options={bedroomQuickOptions}
            onChange={(value) => controller.setMinBedrooms(value === 'any' ? null : Number(value))}
            className="lg:col-span-2"
          />

          <button
            type="submit"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800 lg:col-span-2 lg:h-14"
          >
            <Icon name="search" className="size-4" strokeWidth={2} />
            Search
          </button>
        </div>

        {/* One-tap shortcuts for the most common property types. */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-sand-200 pt-4">
          <span className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">Popular</span>

          {propertyTypeFilterOptions.map((option) => {
            const isActive = filters.propertyType.includes(option.value)

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => controller.togglePropertyType(option.value)}
                className={cn(
                  'inline-flex min-h-9 items-center gap-1.5 rounded-pill px-3 text-xs font-semibold transition-colors duration-200',
                  isActive
                    ? 'bg-accent-600 text-white'
                    : 'border border-sand-200 text-ink-600 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
                )}
              >
                <Icon name="check" className={cn('size-3.5 transition-opacity duration-200', isActive ? 'opacity-100' : 'opacity-0')} strokeWidth={3} />
                {option.label}
              </button>
            )
          })}
        </div>
      </form>
    </div>
  )
}
