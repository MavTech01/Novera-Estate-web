import { useEffect, useState } from 'react'
import { useRentSearch } from '@/features/rent/hooks/useRentSearch'
import type { RentLocation } from '@/features/rent/types/rent.types'
import { Container } from '@/shared/components/ui/Container'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'
import { PropertyFilterSheet } from '@/shared/components/properties/PropertyFilterSheet'

interface RentSearchPanelProps {
  /** The areas from the catalogue — empty until the page's first load resolves. */
  areas: readonly RentLocation[]
}

const ANY = 'any'

/**
 * The guided rental search on the Rent page.
 *
 * Uses `SearchFilterPill` with area suggestions. Clicking the filter icon
 * opens the universal PropertyFilterSheet:
 * - On mobile/small tablet: Bottom sheet sliding up from the bottom.
 * - On desktop: Slide-over desktop drawer from the right.
 */
export function RentSearchPanel({ areas }: RentSearchPanelProps) {
  const { criteria, isValid, update, submit, reset, isFiltered } = useRentSearch(areas)
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
            id="rent-search"
            value={query}
            onChange={(val) => {
              setQuery(val)
              if (criteria.location !== ANY) {
                update('location', ANY)
              }
            }}
            onSubmit={submit}
            isValid={isValid}
            placeholder="Search rentals by area (e.g. Lekki, Ikoyi)..."
            ariaLabel="Search properties to rent"
            filterAriaLabel="Open rental filters"
            showClear={isFiltered}
            onClear={handleClear}
            onFilterToggle={() => setIsFilterSheetOpen(true)}
            helperText="Opens the full catalogue with your filters applied. Rent is shown per year unless stated."
            suggestions={filteredAreas.slice(0, 6).map((area) => ({
              id: area.id,
              label: area.name,
              badge:
                area.forRentCount > 0
                  ? `${area.forRentCount} ${area.forRentCount === 1 ? 'listing' : 'listings'}`
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
        initialPurpose="rent"
        initialQuery={query}
        isDesktopDrawer={true}
      />
    </>
  )
}
