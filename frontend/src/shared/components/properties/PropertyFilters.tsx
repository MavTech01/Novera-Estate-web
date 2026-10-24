import { useMemo } from 'react'

import {
  bathroomOptions,
  bedroomOptions,
  listingStatusOptions,
  propertyFeatureOptions,
  propertyTypeFilterOptions,
} from '@/data/propertyFilters'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/components/ui/Button'
import { CheckboxGroup } from '@/shared/components/ui/CheckboxGroup'
import { Icon } from '@/shared/components/ui/Icon'
import { SelectField } from '@/shared/components/ui/SelectField'
import type { PropertyFiltersController } from '@/shared/types/propertyFiltersController'
import { PropertyFilterGroup } from './PropertyFilterGroup'
import { PropertyPriceRangeSelect } from './PropertyPriceRangeSelect'

interface PropertyFiltersProps {
  controller: PropertyFiltersController
  /**
   * `sidebar` renders a sticky desktop rail, `drawer` fills a mobile sheet.
   * Only affects labelling and the reset control — the groups are identical.
   */
  variant: 'sidebar' | 'drawer'
  /** Namespaces generated ids so both surfaces can coexist in the DOM. */
  idPrefix?: string
  /** Drawer only: dismiss control and the initial focus target. */
  onClose?: () => void
  closeButtonRef?: React.Ref<HTMLButtonElement>
  className?: string
}

/** Locations offered in the facet, ordered alphabetically for scanning. */
const locationOptions = [
  { value: 'lekki-phase-1', label: 'Lekki Phase 1' },
  { value: 'lekki-phase-2', label: 'Lekki Phase 2' },
  { value: 'ajah', label: 'Ajah' },
  { value: 'ikoyi', label: 'Ikoyi' },
  { value: 'ikota', label: 'Ikota' },
  { value: 'victoria-island', label: 'Victoria Island' },
  { value: 'ikeja', label: 'Ikeja' },
  { value: 'yaba', label: 'Yaba' },
  { value: 'sangotedo', label: 'Sangotedo' },
  { value: 'chevron', label: 'Chevron' },
  { value: 'osapa', label: 'Osapa' },
  { value: 'gupe', label: 'Gupe' },
  { value: 'magodo', label: 'Magodo' },
  { value: 'banana-island', label: 'Banana Island' },
  { value: 'okokomaiko', label: 'Okokomaiko' },
]

function toCountOptions(values: number[], noun: string) {
  return [
    { value: 'any', label: `Any ${noun}` },
    ...values.map((value) => ({ value: String(value), label: `${value} or more` })),
  ]
}

/**
 * The complete set of listing filters.
 *
 * Rendered twice — once in the desktop sidebar and once inside the mobile
 * filter drawer — so the two surfaces can never drift apart. It is stateless
 * beyond the collapsible groups: every change goes through the controller.
 */
export function PropertyFilters({
  controller,
  variant,
  idPrefix = 'filters',
  onClose,
  closeButtonRef,
  className,
}: PropertyFiltersProps) {
  const { filters, activeCount, priceBands, priceBandValue } = controller
  const purpose = filters.purpose === 'any' ? 'buy' : filters.purpose

  const bedroomSelectOptions = useMemo(() => toCountOptions(bedroomOptions, 'bedrooms'), [])
  const bathroomSelectOptions = useMemo(() => toCountOptions(bathroomOptions, 'bathrooms'), [])

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      {/* Panel header — the drawer owns its own close affordance. */}
      {variant === 'drawer' && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-sand-200 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg text-ink-900">
            <Icon name="sliders-horizontal" className="size-5 text-accent-600" strokeWidth={2} />
            Filters
            {activeCount > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-pill bg-accent-600 px-1.5 py-0.5 text-xs font-bold leading-none text-white">
                {activeCount}
              </span>
            )}
          </h2>

          {onClose && (
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-ink-500 transition-colors duration-200 hover:bg-tint-50 hover:text-ink-900"
            >
              <Icon name="close" className="size-5" strokeWidth={2} />
              <span className="sr-only">Close filters</span>
            </button>
          )}
        </div>
      )}

      {/* Scrollable filter body for drawer, natural flowing body for sidebar */}
      <div
        className={cn(
          variant === 'drawer'
            ? 'custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2 pb-8 sm:px-7'
            : 'px-1 pt-1.5 pb-2',
        )}
      >
        <PropertyFilterGroup title="Property Type" count={filters.propertyType.length}>
          <CheckboxGroup
            label="Property type"
            options={propertyTypeFilterOptions}
            selected={filters.propertyType}
            onToggle={controller.togglePropertyType}
            columns={2}
          />
        </PropertyFilterGroup>

        <PropertyFilterGroup title="Listing Status" count={filters.statuses.length}>
          <CheckboxGroup
            label="Listing status"
            options={listingStatusOptions.map(({ value, label, description }) => ({
              value,
              label,
              hint: description,
            }))}
            selected={filters.statuses}
            onToggle={controller.toggleStatus}
            iconPosition="trailing"
          />
        </PropertyFilterGroup>

        <PropertyFilterGroup title="Location" count={filters.location.length}>
          <CheckboxGroup
            label="Location"
            options={locationOptions}
            selected={filters.location}
            onToggle={controller.toggleLocation}
            columns={2}
          />
        </PropertyFilterGroup>

        <PropertyFilterGroup title="Price Range" count={filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0}>
          <PropertyPriceRangeSelect
            id={`${idPrefix}-price`}
            purpose={purpose}
            bands={priceBands}
            value={priceBandValue}
            customRange={{ min: filters.minPrice, max: filters.maxPrice }}
            onChange={controller.setPriceBand}
          />
        </PropertyFilterGroup>

        <PropertyFilterGroup title="Bedrooms" count={filters.bedrooms !== null ? 1 : 0}>
          <SelectField
            id={`${idPrefix}-bedrooms`}
            label="Minimum bedrooms"
            value={filters.bedrooms === null ? 'any' : String(filters.bedrooms)}
            options={bedroomSelectOptions}
            onChange={(value) => controller.setMinBedrooms(value === 'any' ? null : Number(value))}
          />
        </PropertyFilterGroup>

        <PropertyFilterGroup title="Bathrooms" count={filters.bathrooms !== null ? 1 : 0} defaultOpen={false}>
          <SelectField
            id={`${idPrefix}-bathrooms`}
            label="Minimum bathrooms"
            value={filters.bathrooms === null ? 'any' : String(filters.bathrooms)}
            options={bathroomSelectOptions}
            onChange={(value) => controller.setMinBathrooms(value === 'any' ? null : Number(value))}
          />
        </PropertyFilterGroup>

        <PropertyFilterGroup title="Features" count={filters.tags.length} defaultOpen={false}>
          <CheckboxGroup
            label="Property features"
            options={propertyFeatureOptions}
            selected={filters.tags}
            onToggle={controller.toggleTag}
            columns={2}
          />
        </PropertyFilterGroup>

        {variant === 'sidebar' && (
          <div className="pt-4">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={controller.reset}
              disabled={activeCount === 0}
              className="w-full justify-center text-ink-600 hover:bg-tint-50 hover:text-accent-700"
            >
              <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
