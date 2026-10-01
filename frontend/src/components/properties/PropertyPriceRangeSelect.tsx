import type { PriceBand } from '@/data/searchOptions'
import { describePriceRange } from '@/data/searchOptions'
import type { PropertyPurpose } from '@/types'
import { SelectField } from '@/shared/components/ui/SelectField'

interface PropertyPriceRangeSelectProps {
  id: string
  purpose: PropertyPurpose
  bands: PriceBand[]
  /** Current selection: a band key, or `custom` for an ad-hoc range. */
  value: string
  /** Explicit bounds, shown when `value` is `custom`. */
  customRange: { min: number | null; max: number | null }
  onChange: (band: PriceBand | null) => void
  label?: string
  className?: string
}

/**
 * Price band select shared by the search bar and the filter panel.
 *
 * Both write the same explicit `minPrice`/`maxPrice` bounds, so the two controls
 * can never disagree. A range that does not match a named band — because it
 * arrived straight from the URL — is surfaced as an extra "custom" option
 * rather than silently discarded.
 */
export function PropertyPriceRangeSelect({
  id,
  purpose,
  bands,
  value,
  customRange,
  onChange,
  label,
  className,
}: PropertyPriceRangeSelectProps) {
  const options =
    value === 'custom'
      ? [{ value: 'custom', label: describePriceRange(customRange.min, customRange.max) }, ...bands]
      : bands

  return (
    <SelectField
      id={id}
      label={label ?? (purpose === 'rent' ? 'Price (per year)' : 'Price')}
      value={value}
      className={className}
      onChange={(next) => {
        const band = bands.find((option) => option.value === next)
        onChange(band && band.value !== 'any' ? band : null)
      }}
      options={options}
    />
  )
}
