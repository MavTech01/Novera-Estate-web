import { getPriceBands } from '@/data/searchOptions'
import { buyPropertyTypes } from '@/features/buy/data/buyData'
import { useBuySearch } from '@/features/buy/hooks/useBuySearch'
import { ANY_FILTER } from '@/features/buy/utils/buyQuery'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SelectField } from '@/shared/components/ui/SelectField'
import { propertyTypeLabels } from '@/shared/lib/labels'
import { describePriceRange } from '@/data/searchOptions'
import type { BuyLocation, BuySearchCriteria } from '@/features/buy/types/buy.types'

interface BuySearchPanelProps {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly BuyLocation[]
}

/**
 * The guided "for sale" search on the Buy page.
 *
 * Intentional differences from the full listing page:
 *
 *  - **Listing type is fixed to "For Sale"** and rendered as a read-only field —
 *    this page is specifically about buying, and the choice is made in the nav.
 *  - **The search hand-off happens to `/properties`** with the exact parameters
 *    that page already understands. Submitting a search here is the same as
 *    choosing those filters there; the panels differ, the catalogue doesn't.
 *
 * The panel is fully URL-backed via `useBuySearch`, so a search is shareable the
 * moment it is composed, not only once submitted.
 */
export function BuySearchPanel({ areas }: BuySearchPanelProps) {
  const { criteria, validationMessage, isValid, update, submit, reset } = useBuySearch(areas)

  const locationOptions = [
    { value: ANY_FILTER, label: 'Any area' },
    ...areas.map((area) => ({ value: area.slug, label: area.name })),
  ]

  const typeOptions = [
    { value: ANY_FILTER, label: 'Any property type' },
    ...buyPropertyTypes.map((type) => ({ value: type, label: propertyTypeLabels[type] })),
  ]

  const buyBands = getPriceBands('buy')

  const minPriceOptions = [
    { value: ANY_FILTER, label: 'Any budget' },
    ...buyBands
      .filter((band) => band.min !== undefined)
      .map((band) => ({
        value: String(band.min),
        label: describePriceRange(band.min ?? null, null),
      })),
  ]

  const maxPriceOptions = [
    { value: ANY_FILTER, label: 'No upper limit' },
    ...buyBands
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
        id="buy-search"
        className="relative z-10 scroll-mt-24 rounded-2xl border border-sand-200 bg-white p-6 shadow-xl sm:p-8 lg:-mt-14 lg:p-10"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (isValid) submit()
          }}
          noValidate
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Listing type stays fixed: the whole page is about buying. */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="buy-listing-type" className="text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
                Listing type
              </label>
              <div className="relative">
                <select
                  id="buy-listing-type"
                  name="listing-type"
                  value="buy"
                  disabled
                  aria-describedby="buy-listing-type-note"
                  className="h-12 w-full cursor-not-allowed appearance-none truncate rounded-md border border-sand-200 bg-sand-100 pl-3.5 pr-10 text-sm font-semibold text-ink-400"
                >
                  <option value="buy">For Sale</option>
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-accent-500"
                  strokeWidth={2.2}
                />
              </div>
              <p id="buy-listing-type-note" className="sr-only">
                This page shows properties available for purchase.
              </p>
            </div>

            <SelectField
              id="buy-location"
              label="Location"
              value={criteria.location}
              options={locationOptions}
              onChange={(value) => update('location', value)}
            />

            <SelectField
              id="buy-type"
              label="Property type"
              value={criteria.propertyType}
              options={typeOptions}
              onChange={(value) => update('propertyType', value as BuySearchCriteria['propertyType'])}
            />

            <SelectField
              id="buy-min-price"
              label="Minimum budget"
              value={criteria.minPrice}
              options={minPriceOptions}
              onChange={(value) => update('minPrice', value)}
            />

            <SelectField
              id="buy-max-price"
              label="Maximum budget"
              value={criteria.maxPrice}
              options={maxPriceOptions}
              onChange={(value) => update('maxPrice', value)}
            />

            <SelectField
              id="buy-bedrooms"
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
                Search Properties
              </Button>
              <Button type="button" variant="ghost" size="lg" onClick={reset}>
                <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
                Reset search
              </Button>
            </div>
            <p className="flex items-center gap-2 text-sm text-ink-500">
              <Icon name="arrow-right" className="size-4 shrink-0" strokeWidth={2} />
              Opens the full catalogue with your filters applied.
            </p>
          </div>
        </form>
      </div>
    </Container>
  )
}