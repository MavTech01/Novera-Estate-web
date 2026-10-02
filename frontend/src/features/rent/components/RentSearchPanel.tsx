import { getPriceBands } from '@/data/searchOptions'
import { rentPropertyTypes } from '@/features/rent/data/rentData'
import { useRentSearch } from '@/features/rent/hooks/useRentSearch'
import { ANY_FILTER } from '@/features/rent/utils/rentQuery'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SelectField } from '@/shared/components/ui/SelectField'
import { propertyTypeLabels } from '@/shared/lib/labels'
import { describePriceRange } from '@/data/searchOptions'
import type { RentLocation, RentSearchCriteria } from '@/features/rent/types/rent.types'

interface RentSearchPanelProps {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly RentLocation[]
}

/**
 * The guided rental search on the Rent page.
 *
 * Intentional differences from the full listing page:
 *
 *  - **Listing type is fixed to "For Rent"** and rendered as a read-only field —
 *    this page is specifically about renting, and the choice is made in the nav.
 *  - **The budget reads as rent, not a purchase price**, and the bands carry
 *    their period (`/ year`) so a figure can never be mistaken for the full
 *    price of a property.
 *  - **The search hand-off happens to `/properties`** with the exact parameters
 *    that page already understands (`purpose=rent`). Submitting a search here is
 *    the same as choosing those filters there; the panels differ, the catalogue
 *    doesn't.
 *
 * The panel is fully URL-backed via `useRentSearch`, so a search is shareable
 * the moment it is composed, not only once submitted.
 */
export function RentSearchPanel({ areas }: RentSearchPanelProps) {
  const { criteria, validationMessage, isValid, update, submit, reset } = useRentSearch(areas)

  const locationOptions = [
    { value: ANY_FILTER, label: 'Any area' },
    ...areas.map((area) => ({ value: area.slug, label: area.name })),
  ]

  const typeOptions = [
    { value: ANY_FILTER, label: 'Any property type' },
    ...rentPropertyTypes.map((type) => ({ value: type, label: propertyTypeLabels[type] })),
  ]

  const rentBands = getPriceBands('rent')

  const minPriceOptions = [
    { value: ANY_FILTER, label: 'Any rent' },
    ...rentBands
      .filter((band) => band.min !== undefined)
      .map((band) => ({
        value: String(band.min),
        label: describePriceRange(band.min ?? null, null),
      })),
  ]

  const maxPriceOptions = [
    { value: ANY_FILTER, label: 'No upper limit' },
    ...rentBands
      .filter((band) => band.max !== undefined)
      .map((band) => ({
        value: String(band.max),
        label: describePriceRange(null, band.max ?? null),
      })),
  ]

  const bedroomOptions = [
    { value: ANY_FILTER, label: 'Any bedrooms' },
    ...[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}+` })),
  ]

  return (
    <Container>
      <div
        id="rent-search"
        className="relative z-10 scroll-mt-24 rounded-2xl border border-sand-200 bg-white p-6 shadow-xl sm:p-8 lg:-mt-6 lg:p-10"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (isValid) submit()
          }}
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Listing type stays fixed: the whole page is about renting. */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="rent-listing-type" className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
                Listing type
              </label>
              <div className="relative">
                <select
                  id="rent-listing-type"
                  name="listing-type"
                  value="rent"
                  disabled
                  aria-describedby="rent-listing-type-note"
                  className="h-12 w-full cursor-not-allowed appearance-none truncate rounded-md border border-sand-200 bg-sand-100 pl-3.5 pr-10 text-sm font-semibold text-ink-400"
                >
                  <option value="rent">For Rent</option>
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-accent-500"
                  strokeWidth={2.2}
                />
              </div>
              <p id="rent-listing-type-note" className="sr-only">
                This page shows properties available to rent.
              </p>
            </div>

            <SelectField
              id="rent-location"
              label="Location"
              value={criteria.location}
              options={locationOptions}
              onChange={(value) => update('location', value)}
            />

            <SelectField
              id="rent-type"
              label="Property type"
              value={criteria.propertyType}
              options={typeOptions}
              onChange={(value) => update('propertyType', value as RentSearchCriteria['propertyType'])}
            />

            <SelectField
              id="rent-min-price"
              label="Minimum rent"
              value={criteria.minPrice}
              options={minPriceOptions}
              onChange={(value) => update('minPrice', value)}
            />

            <SelectField
              id="rent-max-price"
              label="Maximum rent"
              value={criteria.maxPrice}
              options={maxPriceOptions}
              onChange={(value) => update('maxPrice', value)}
            />

            <SelectField
              id="rent-bedrooms"
              label="Bedrooms"
              value={criteria.bedrooms}
              options={bedroomOptions}
              onChange={(value) => update('bedrooms', value)}
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
                Search Rentals
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={reset}>
                <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
                Reset search
              </Button>
            </div>
            <p className="flex items-center gap-2 text-sm text-ink-500">
              <Icon name="arrow-right" className="size-4 shrink-0" strokeWidth={2} />
              Opens the full catalogue with your filters applied. Rent is shown per year unless stated.
            </p>
          </div>
        </form>
      </div>
    </Container>
  )
}
