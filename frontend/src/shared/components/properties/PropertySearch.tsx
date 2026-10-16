import { getSearchableLocations } from '@/data'
import { getPriceBands, propertyTypeOptions, purposeOptions } from '@/data/searchOptions'
import type { PropertyPurpose, PropertySearchCriteria, PropertyType } from '@/types'
import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextField } from '@/shared/components/ui/TextField'

interface PropertySearchProps {
  criteria: PropertySearchCriteria
  onChange: <K extends keyof PropertySearchCriteria>(key: K, value: PropertySearchCriteria[K]) => void
  onSubmit: () => void
  className?: string
}

/**
 * Floating search panel that overlaps the hero: buy/rent tabs, then
 * location, property type and budget followed by the primary action.
 */
export function PropertySearch({ criteria, onChange, onSubmit, className }: PropertySearchProps) {
  const locations = getSearchableLocations()
  const priceBands = getPriceBands(criteria.purpose)

  return (
    <form
      role="search"
      aria-label="Search properties"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className={cn('rounded-xl border border-sand-200 bg-white p-5 shadow-md sm:p-6', className)}
    >
      <div className="flex flex-col gap-4 border-b border-sand-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <SegmentedControl
          label="Purpose"
          value={criteria.purpose}
          options={purposeOptions}
          onChange={(value: PropertyPurpose) => onChange('purpose', value)}
          className="w-full sm:w-auto"
        />

        {/* Quick links keep the tool discoverable without adding more fields. */}
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-ink-400">
          <span className="font-semibold uppercase tracking-[0.12em]">Popular</span>
          {locations.slice(0, 4).map((location) => (
            <button
              key={location.id}
              type="button"
              onClick={() => onChange('location', location.name)}
              className="min-h-8 rounded-pill px-2 font-semibold text-ink-600 transition-colors duration-200 hover:bg-tint-50 hover:text-accent-700"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-3">
        <TextField
          id="search-location"
          label="Location"
          value={criteria.location}
          onChange={(value) => onChange('location', value)}
          placeholder="Search location"
          className="lg:col-span-3"
        />

        <SelectField
          id="search-property-type"
          label="Property Type"
          value={criteria.propertyType}
          options={propertyTypeOptions}
          onChange={(value) => onChange('propertyType', value as PropertyType | 'any')}
          className="lg:col-span-3"
        />

        <SelectField
          id="search-price"
          label={criteria.purpose === 'rent' ? 'Rent (per year)' : 'Price'}
          value={criteria.price}
          options={priceBands}
          onChange={(value) => onChange('price', value)}
          className="lg:col-span-3"
        />

        <button
          type="submit"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800 lg:col-span-3 lg:h-14"
        >
          <Icon name="search" className="size-4" strokeWidth={2} />
          Search Now
        </button>
      </div>
    </form>
  )
}
