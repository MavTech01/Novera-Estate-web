import { useEffect, useRef, useState } from 'react'
import { getSearchableLocations } from '@/data'
import type { PropertySearchCriteria, PropertyType } from '@/types'
import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'
import { HeroLocationSuggestions } from './HeroLocationSuggestions'
import { PropertyFilterSheet } from '@/shared/components/properties/PropertyFilterSheet'

interface HeroSearchBarProps {
  criteria: PropertySearchCriteria
  onLocationChange: (location: string) => void
  onTypeChange: (type: PropertyType | 'any') => void
  onPriceChange: (price: string) => void
  onSubmit: () => void
  className?: string
}

export function HeroSearchBar({
  criteria,
  onLocationChange,
  onTypeChange: _onTypeChange,
  onPriceChange: _onPriceChange,
  onSubmit,
  className,
}: HeroSearchBarProps) {
  const locations = getSearchableLocations()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showFilterSheet, setShowFilterSheet] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  const filtered = criteria.location
    ? locations.filter((loc) => loc.name.toLowerCase().includes(criteria.location.toLowerCase()))
    : locations

  const activeFiltersCount =
    (criteria.propertyType !== 'any' ? 1 : 0) + (criteria.price !== 'any' ? 1 : 0)

  return (
    <>
      <div ref={containerRef} className={cn('relative', className)}>
        <form
          role="search"
          aria-label="Search properties by location"
          onSubmit={(e) => {
            e.preventDefault()
            setShowSuggestions(false)
            onSubmit()
          }}
          className="flex h-14 items-center rounded-full bg-white pl-4 pr-1.5 shadow-2xl transition-all sm:h-15 sm:pl-5"
        >
          {/* Location Icon */}
          <Icon name="map-pin" className="size-5 shrink-0 text-ink-400" strokeWidth={2} />

          {/* Location Input */}
          <input
            type="text"
            value={criteria.location}
            onChange={(e) => {
              onLocationChange(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => {
              setShowSuggestions(true)
            }}
            placeholder="Search by location..."
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink-900 outline-none placeholder:text-ink-400 sm:text-base"
          />

          {/* Filter Trigger Button — Opens Universal Filter Sheet */}
          <button
            type="button"
            onClick={() => {
              setShowFilterSheet(true)
              setShowSuggestions(false)
            }}
            className={cn(
              'relative mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
              showFilterSheet || activeFiltersCount > 0
                ? 'bg-accent-50 text-accent-600'
                : 'text-ink-500 hover:bg-sand-100 hover:text-ink-800',
            )}
            aria-label="Open search filters"
            aria-expanded={showFilterSheet}
          >
            <Icon name="sliders-horizontal" className="size-4.5" strokeWidth={2} />
            {activeFiltersCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent-600 text-[0.625rem] font-bold text-white shadow-xs">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Circular Search Action Button */}
          <button
            type="submit"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent-600 text-white shadow-md transition-all hover:bg-accent-700 active:bg-accent-800 active:scale-95"
            aria-label="Search"
          >
            <Icon name="search" className="size-5" strokeWidth={2.5} />
          </button>
        </form>

        {/* Location Suggestions Dropdown */}
        {showSuggestions && (
          <HeroLocationSuggestions
            locations={filtered}
            onSelect={(name) => {
              onLocationChange(name)
              setShowSuggestions(false)
            }}
          />
        )}
      </div>

      {/* Universal Property Filter Sheet: Bottom sheet on mobile / small tab, desktop drawer on desktop */}
      <PropertyFilterSheet
        isOpen={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        initialPurpose={criteria.purpose}
        initialQuery={criteria.location}
        isDesktopDrawer={true}
      />
    </>
  )
}
