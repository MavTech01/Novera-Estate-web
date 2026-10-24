import { useEffect, useState } from 'react'
import { useBuySearch } from '@/features/buy/hooks/useBuySearch'
import type { BuyLocation } from '@/features/buy/types/buy.types'
import { Container } from '@/shared/components/ui/Container'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'
import { PropertyFilterSheet } from '@/shared/components/properties/PropertyFilterSheet'

interface BuySearchPanelProps {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly BuyLocation[]
}

const ANY = 'any'

/**
 * The guided "for sale" search on the Buy page.
 *
 * Uses `SearchFilterPill` with area suggestions. Clicking the filter icon
 * opens the universal PropertyFilterSheet:
 * - On mobile/small tablet: Bottom sheet sliding up from the bottom.
 * - On desktop: Slide-over desktop drawer from the right.
 */
export function BuySearchPanel({ areas }: BuySearchPanelProps) {
  const { criteria, isValid, update, submit, reset, isFiltered } = useBuySearch(areas)
  const [query, setQuery] = useState('')
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

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

  return (
    <>
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
            filterAriaLabel="Open property filters"
            showClear={isFiltered}
            onClear={handleClear}
            onFilterToggle={() => setIsFilterSheetOpen(true)}
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

      {/* Universal Filter Sheet: Bottom sheet on mobile / small tab, desktop drawer on desktop */}
      <PropertyFilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        initialPurpose="buy"
        initialQuery={query}
        isDesktopDrawer={true}
      />
    </>
  )
}
