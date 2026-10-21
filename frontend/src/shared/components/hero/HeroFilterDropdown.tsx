import { getPriceBands, propertyTypeOptions } from '@/data/searchOptions'
import type { PropertySearchCriteria, PropertyType } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'

interface HeroFilterDropdownProps {
  criteria: PropertySearchCriteria
  onTypeChange: (type: PropertyType | 'any') => void
  onPriceChange: (price: string) => void
  onClose: () => void
}

export function HeroFilterDropdown({
  criteria,
  onTypeChange,
  onPriceChange,
  onClose,
}: HeroFilterDropdownProps) {
  const priceBands = getPriceBands(criteria.purpose)
  const hasActiveFilters = criteria.propertyType !== 'any' || criteria.price !== 'any'

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-sand-200 bg-white p-5 text-left shadow-2xl animate-fade-up sm:w-full">
      <div className="flex items-center justify-between pb-3">
        <h3 className="font-display text-sm font-bold text-ink-900">Search Filters</h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              onTypeChange('any')
              onPriceChange('any')
            }}
            className="text-xs font-semibold text-accent-600 transition-colors hover:text-accent-700"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-3 space-y-4">
        {/* Property Type Select */}
        <div>
          <label
            htmlFor="filter-property-type"
            className="text-xs font-semibold uppercase tracking-wider text-ink-500"
          >
            Property Type
          </label>
          <div className="relative mt-1.5">
            <select
              id="filter-property-type"
              value={criteria.propertyType}
              onChange={(e) => onTypeChange(e.target.value as PropertyType | 'any')}
              className="w-full appearance-none rounded-xl border border-sand-200 bg-sand-50/50 px-3.5 py-2.5 pr-9 text-sm font-medium text-ink-900 outline-none transition-colors hover:border-sand-300 focus:border-accent-600 focus:bg-white focus:ring-1 focus:ring-accent-600"
            >
              {propertyTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
            />
          </div>
        </div>

        {/* Price Range Slider */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="filter-price-slider"
              className="text-xs font-semibold uppercase tracking-wider text-ink-500"
            >
              Price Range ({criteria.purpose === 'buy' ? 'Buy' : 'Rent'})
            </label>
            <span className="text-xs font-bold text-accent-600">
              {priceBands.find((b) => b.value === criteria.price)?.label ?? 'Any price'}
            </span>
          </div>
          <div className="mt-2.5">
            <input
              id="filter-price-slider"
              type="range"
              min="0"
              max={priceBands.length - 1}
              step="1"
              value={Math.max(0, priceBands.findIndex((b) => b.value === criteria.price))}
              onChange={(e) => {
                const index = Number(e.target.value)
                onPriceChange(priceBands[index]?.value ?? 'any')
              }}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-sand-200 accent-accent-600 transition-colors focus:outline-none"
            />
            <div className="mt-1 flex justify-between text-[0.6875rem] font-medium text-ink-400">
              <span>{priceBands[0]?.label}</span>
              <span>{priceBands[priceBands.length - 1]?.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apply / Close button */}
      <div className="mt-5 flex justify-end pt-1">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-ink-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-ink-800"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
