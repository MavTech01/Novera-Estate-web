import { propertySortOptions } from '@/data/propertyFilters'
import type { PropertySort } from '@/types'
import { SelectField } from '@/shared/components/ui/SelectField'

interface PropertySortProps {
  value: PropertySort
  onChange: (sort: PropertySort) => void
  id?: string
  className?: string
}

/**
 * Sort control for the results header.
 * Reuses the shared select so it inherits the platform's field styling and
 * native mobile pickers.
 */
export function PropertySort({ value, onChange, id = 'property-sort', className }: PropertySortProps) {
  return (
    <div className={className}>
      <SelectField
        id={id}
        label="Sort by"
        value={value}
        options={propertySortOptions}
        onChange={(next) => onChange(next as PropertySort)}
      />
    </div>
  )
}
