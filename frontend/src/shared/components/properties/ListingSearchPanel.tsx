import { describePriceRange, getPriceBands } from '@/data/searchOptions'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SelectField } from '@/shared/components/ui/SelectField'
import { propertyTypeLabels } from '@/shared/lib/labels'
import type { ListingSearchArea, ListingSearchCriteria } from '@/shared/lib/propertySearchQuery'
import type { PropertyPurpose, PropertyType } from '@/types'

export type ListingSearchPanelPurpose = PropertyPurpose

export interface ListingSearchPanelPriceBands {
  purpose: ListingSearchPanelPurpose
  bands: ReturnType<typeof getPriceBands>
}

export interface ListingSearchPanelCopy {
  listingTypeLabel: string
  listingTypeValue: ListingSearchPanelPurpose
  listingTypeOptionText: string
  listingTypeNote: string
  locationLabel: string
  propertyTypeLabel: string
  minPriceLabel: string
  maxPriceLabel: string
  anyAreaLabel: string
  anyPropertyTypeLabel: string
  anyMinPriceLabel: string
  anyMaxPriceLabel: string
  anyBedroomsLabel: string
  submitLabel: string
  resetLabel: string
  footerNote: string
}

export interface ListingSearchPanelProps {
  idPrefix: ListingSearchPanelPurpose
  areas: readonly ListingSearchArea[]
  criteria: ListingSearchCriteria
  isValid: boolean
  validationMessage: string | null
  priceBands: ReturnType<typeof getPriceBands>
  propertyTypeOptions: readonly PropertyType[]
  copy: ListingSearchPanelCopy
  onUpdate: <K extends keyof ListingSearchCriteria>(key: K, value: ListingSearchCriteria[K]) => void
  onSubmit: () => void
  onReset: () => void
}

const ANY_FILTER = 'any'

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  value: String(n),
  label: `${n}+`,
}))

/**
 * The shared search panel UI for the Buy and Rent pages.
 *
 * This component owns only presentation and user interaction for the five-field
 * listing search (location, property type, min price, max price, bedrooms). All
 * URL/state wiring, validation semantics and feature-specific data remain in the
 * calling feature wrappers.
 */
export function ListingSearchPanel({
  idPrefix,
  areas,
  criteria,
  isValid,
  validationMessage,
  priceBands,
  propertyTypeOptions,
  copy,
  onUpdate,
  onSubmit,
  onReset,
}: ListingSearchPanelProps) {
  const locationOptions = [
    { value: ANY_FILTER, label: copy.anyAreaLabel },
    ...areas.map((area) => ({ value: area.slug, label: area.name ?? area.label ?? area.slug })),
  ]

  const typeOptions = [
    { value: ANY_FILTER, label: copy.anyPropertyTypeLabel },
    ...propertyTypeOptions.map((type) => ({ value: type, label: propertyTypeLabels[type] })),
  ]

  const minPriceOptions = [
    { value: ANY_FILTER, label: copy.anyMinPriceLabel },
    ...priceBands
      .filter((band) => band.min !== undefined)
      .map((band) => ({
        value: String(band.min),
        label: describePriceRange(band.min ?? null, null),
      })),
  ]

  const maxPriceOptions = [
    { value: ANY_FILTER, label: copy.anyMaxPriceLabel },
    ...priceBands
      .filter((band) => band.max !== undefined)
      .map((band) => ({
        value: String(band.max),
        label: describePriceRange(null, band.max ?? null),
      })),
  ]

  const bedroomOptions = [{ value: ANY_FILTER, label: copy.anyBedroomsLabel }, ...BEDROOM_OPTIONS]

  return (
    <Container>
      <div
        id={`${idPrefix}-search`}
        className="relative z-10 scroll-mt-24 rounded-2xl border border-sand-200 bg-white p-6 shadow-xl sm:p-8 lg:-mt-6 lg:p-10"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (isValid) onSubmit()
          }}
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Listing type stays fixed: the whole page is about one purpose. */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`${idPrefix}-listing-type`}
                className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400"
              >
                {copy.listingTypeLabel}
              </label>
              <div className="relative">
                <select
                  id={`${idPrefix}-listing-type`}
                  name="listing-type"
                  value={copy.listingTypeValue}
                  disabled
                  aria-describedby={`${idPrefix}-listing-type-note`}
                  className="h-12 w-full cursor-not-allowed appearance-none truncate rounded-md border border-sand-200 bg-sand-100 pl-3.5 pr-10 text-sm font-semibold text-ink-400"
                >
                  <option value={copy.listingTypeValue}>{copy.listingTypeOptionText}</option>
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-accent-500"
                  strokeWidth={2.2}
                />
              </div>
              <p id={`${idPrefix}-listing-type-note`} className="sr-only">
                {copy.listingTypeNote}
              </p>
            </div>

            <SelectField
              id={`${idPrefix}-location`}
              label={copy.locationLabel}
              value={criteria.location}
              options={locationOptions}
              onChange={(value) => onUpdate('location', value)}
            />

            <SelectField
              id={`${idPrefix}-type`}
              label={copy.propertyTypeLabel}
              value={criteria.propertyType}
              options={typeOptions}
              onChange={(value) => onUpdate('propertyType', value as PropertyType | typeof ANY_FILTER)}
            />

            <SelectField
              id={`${idPrefix}-min-price`}
              label={copy.minPriceLabel}
              value={criteria.minPrice}
              options={minPriceOptions}
              onChange={(value) => onUpdate('minPrice', value)}
            />

            <SelectField
              id={`${idPrefix}-max-price`}
              label={copy.maxPriceLabel}
              value={criteria.maxPrice}
              options={maxPriceOptions}
              onChange={(value) => onUpdate('maxPrice', value)}
            />

            <SelectField
              id={`${idPrefix}-bedrooms`}
              label={copy.anyBedroomsLabel}
              value={criteria.bedrooms}
              options={bedroomOptions}
              onChange={(value) => onUpdate('bedrooms', value)}
            />
          </div>

          {validationMessage && (
            <p role="alert" className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600">
              <Icon name="triangle-alert" className="size-4 shrink-0" strokeWidth={2} />
              {validationMessage}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-sand-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" variant="primary" size="lg" withArrow>
                {copy.submitLabel}
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={onReset}>
                <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
                {copy.resetLabel}
              </Button>
            </div>
            <p className="flex items-center gap-2 text-sm text-ink-500">
              <Icon name="arrow-right" className="size-4 shrink-0" strokeWidth={2} />
              {copy.footerNote}
            </p>
          </div>
        </form>
      </div>
    </Container>
  )
}
