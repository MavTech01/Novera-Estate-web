import { useEffect, useState } from 'react'
import { getPriceBands, describePriceRange } from '@/data/searchOptions'
import { buyPropertyTypes } from '@/features/buy/data/buyData'
import { useBuySearch } from '@/features/buy/hooks/useBuySearch'
import type { BuyLocation } from '@/features/buy/types/buy.types'
import { propertyTypeLabels } from '@/shared/lib/labels'
import { Icon } from '@/shared/components/ui/Icon'
import { Container } from '@/shared/components/ui/Container'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'
import type { PropertyType } from '@/types'

interface BuySearchPanelProps {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly BuyLocation[]
}

const ANY = 'any'

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n}+`,
}))

/**
 * The guided "for sale" search on the Buy page.
 *
 * Uses the reusable `SearchFilterPill` with a dropdown popover for property type,
 * budget and bedrooms, and autocomplete suggestions for areas.
 */
export function BuySearchPanel({ areas }: BuySearchPanelProps) {
  const { criteria, isValid, validationMessage, update, submit, reset, isFiltered } =
    useBuySearch(areas)

  const [query, setQuery] = useState('')

  // Count how many extra filters are active (excluding location)
  const extraFilterCount = [
    criteria.propertyType !== ANY,
    criteria.minPrice !== ANY,
    criteria.maxPrice !== ANY,
    criteria.bedrooms !== ANY,
  ].filter(Boolean).length

  // Sync the query input with the current criteria location name
  useEffect(() => {
    if (criteria.location !== ANY) {
      const area = areas.find((a) => a.slug === criteria.location)
      if (area) setQuery(area.name)
    }
  }, [criteria.location, areas])

  const filteredAreas = query
    ? areas.filter((area) => area.name.toLowerCase().includes(query.toLowerCase()))
    : areas

  const handleSelectArea = (slug: string, name: string) => {
    update('location', slug)
    setQuery(name)
  }

  const handleClear = () => {
    reset()
    setQuery('')
  }

  // Price bands for buy
  const priceBands = getPriceBands('buy')

  const minPriceOptions = [
    { value: ANY, label: 'Any budget' },
    ...priceBands
      .filter((band) => band.min !== undefined)
      .map((band) => ({
        value: String(band.min),
        label: describePriceRange(band.min ?? null, null),
      })),
  ]

  const maxPriceOptions = [
    { value: ANY, label: 'No upper limit' },
    ...priceBands
      .filter((band) => band.max !== undefined)
      .map((band) => ({
        value: String(band.max),
        label: describePriceRange(null, band.max ?? null),
      })),
  ]

  const typeOptions = [
    { value: ANY, label: 'Any property type' },
    ...buyPropertyTypes.map((type) => ({ value: type, label: propertyTypeLabels[type] })),
  ]

  const bedroomOptions = [{ value: ANY, label: 'Any bedrooms' }, ...BEDROOM_OPTIONS]

  const filterContent = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Refine Search</h3>
        {extraFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              update('propertyType', ANY as PropertyType | typeof ANY)
              update('minPrice', ANY)
              update('maxPrice', ANY)
              update('bedrooms', ANY)
            }}
            className="text-xs font-medium text-accent-600 transition-colors hover:text-accent-800"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Property Type */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="buy-filter-type"
            className="text-xs font-medium uppercase tracking-wide text-ink-400"
          >
            Property type
          </label>
          <div className="relative">
            <select
              id="buy-filter-type"
              value={criteria.propertyType}
              onChange={(e) =>
                update('propertyType', e.target.value as PropertyType | typeof ANY)
              }
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-sand-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-accent-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="buy-filter-bedrooms"
            className="text-xs font-medium uppercase tracking-wide text-ink-400"
          >
            Bedrooms
          </label>
          <div className="relative">
            <select
              id="buy-filter-bedrooms"
              value={criteria.bedrooms}
              onChange={(e) => update('bedrooms', e.target.value)}
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-sand-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-accent-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              {bedroomOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Min Price */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="buy-filter-min-price"
            className="text-xs font-medium uppercase tracking-wide text-ink-400"
          >
            Min budget
          </label>
          <div className="relative">
            <select
              id="buy-filter-min-price"
              value={criteria.minPrice}
              onChange={(e) => update('minPrice', e.target.value)}
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-sand-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-accent-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              {minPriceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Max Price */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="buy-filter-max-price"
            className="text-xs font-medium uppercase tracking-wide text-ink-400"
          >
            Max budget
          </label>
          <div className="relative">
            <select
              id="buy-filter-max-price"
              value={criteria.maxPrice}
              onChange={(e) => update('maxPrice', e.target.value)}
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-sand-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-accent-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              {maxPriceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>

      {/* Validation message */}
      {validationMessage && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 text-xs font-medium text-red-600 sm:text-sm"
        >
          <Icon name="triangle-alert" className="size-4 shrink-0" strokeWidth={2} />
          {validationMessage}
        </p>
      )}
    </div>
  )

  return (
    <div className="relative z-10 pt-6 sm:pt-8 lg:pt-10">
      <Container className="max-w-2xl">
        <SearchFilterPill
          id="buy-search"
          value={query}
          onChange={(val) => {
            setQuery(val)
            if (criteria.location !== ANY) {
              update('location', ANY)
            }
          }}
          onSubmit={submit}
          isValid={isValid}
          placeholder="Search by area (e.g. Lekki, Ikoyi)..."
          ariaLabel="Search properties for sale"
          filterAriaLabel="Toggle property filters"
          showClear={isFiltered}
          onClear={handleClear}
          activeFilterCount={extraFilterCount}
          filterContent={filterContent}
          helperText="Opens the full catalogue with your filters applied."
          suggestions={filteredAreas.slice(0, 6).map((area) => ({
            id: area.id,
            label: area.name,
            badge:
              area.forSaleCount > 0
                ? `${area.forSaleCount} ${area.forSaleCount === 1 ? 'listing' : 'listings'}`
                : undefined,
          }))}
          onSelectSuggestion={(item) => {
            const area = areas.find((a) => a.id === item.id)
            if (area) {
              handleSelectArea(area.slug, area.name)
            }
          }}
          noSuggestionsText={query.length > 0 ? `No areas match "${query}"` : undefined}
        />
      </Container>
    </div>
  )
}
