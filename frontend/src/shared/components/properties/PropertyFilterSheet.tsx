import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useLockBodyScroll } from '@/shared/hooks/useLockBodyScroll'
import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { PropertyFilters } from './PropertyFilters'
import { properties } from '@/data/properties'
import {
  defaultFilters,
  defaultSort,
  describeActiveFilters,
  filterProperties,
  serialiseQuery,
  toggleListValue,
} from '@/shared/lib/propertyQuery'
import { findPriceBandByBounds, getPriceBands } from '@/data/searchOptions'
import { routes } from '@/shared/lib/routes'
import type { PropertyFiltersController } from '@/shared/types/propertyFiltersController'
import type {
  PropertyFilters as PropertyFiltersType,
  PropertyPurpose,
} from '@/types'

export interface PropertyFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  /** If provided, uses this external controller (e.g. on PropertiesPage). */
  controller?: PropertyFiltersController
  /** Result count when controller is supplied. Otherwise computed live against catalogue. */
  resultCount?: number
  /** Preset purpose in standalone mode ('buy' | 'rent' | 'any'). */
  initialPurpose?: PropertyPurpose | 'any'
  /** Initial location query if visitor already typed in search bar. */
  initialQuery?: string
  /**
   * If true, renders as a slide-over panel on desktop (`lg+`).
   * If false, hides on desktop (e.g. on PropertiesPage where desktop has the inline sidebar rail).
   */
  isDesktopDrawer?: boolean
  /** Custom submit handler. If omitted in standalone mode, navigates to `/properties?...`. */
  onApply?: (filters: PropertyFiltersType) => void
}

/**
 * Universal Filter Sheet:
 * - Mobile & small tablets (< lg): Smooth bottom sheet that slides up from the bottom with top grab-handle.
 * - Desktop (lg+): Displays as a slide-over drawer from the right on standalone pages (Home, Buy, Rent),
 *   or hidden on the Properties page where desktop uses the inline sidebar rail.
 * - Reusable everywhere with live match count and commit navigation.
 */
export function PropertyFilterSheet({
  isOpen,
  onClose,
  controller: externalController,
  resultCount: externalResultCount,
  initialPurpose = 'any',
  initialQuery = '',
  isDesktopDrawer = false,
  onApply,
}: PropertyFilterSheetProps) {
  const navigate = useNavigate()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useLockBodyScroll(isOpen)

  // Standalone filter state (when external controller is not provided)
  const [standaloneFilters, setStandaloneFilters] = useState<PropertyFiltersType>(() => ({
    ...defaultFilters,
    purpose: initialPurpose,
    query: initialQuery,
  }))

  // Sync initial purpose/query when sheet opens without triggering effect-cascade
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen && !externalController) {
      setStandaloneFilters((prev) => ({
        ...prev,
        purpose: initialPurpose !== 'any' ? initialPurpose : prev.purpose,
        query: initialQuery || prev.query,
      }))
    }
  }

  // Compute live matched count in standalone mode
  const standaloneResultCount = useMemo(() => {
    return filterProperties(properties, standaloneFilters).length
  }, [standaloneFilters])

  const standalonePurpose: PropertyPurpose =
    standaloneFilters.purpose === 'any' ? 'buy' : standaloneFilters.purpose

  // Standalone controller actions
  const { standalonePriceBands, standalonePriceBandValue } = useMemo(() => {
    const bands = getPriceBands(standalonePurpose)
    const match =
      findPriceBandByBounds(standalonePurpose, standaloneFilters.minPrice, standaloneFilters.maxPrice) ??
      bands.find((band) => band.min === standaloneFilters.minPrice && band.max === standaloneFilters.maxPrice)

    return { standalonePriceBands: bands, standalonePriceBandValue: match?.value ?? 'custom' }
  }, [standalonePurpose, standaloneFilters.minPrice, standaloneFilters.maxPrice])

  const standaloneActiveFilters = useMemo(() => {
    return describeActiveFilters(standaloneFilters)
  }, [standaloneFilters])

  const standaloneController: PropertyFiltersController = useMemo(() => {
    return {
      filters: standaloneFilters,
      sort: defaultSort,
      page: 1,
      activeCount: standaloneActiveFilters.length,
      activeFilters: standaloneActiveFilters,
      priceBands: standalonePriceBands,
      priceBandValue: standalonePriceBandValue,
      isFiltered: standaloneActiveFilters.length > 0,
      setPurpose: (p) => setStandaloneFilters((prev) => ({ ...prev, purpose: p })),
      setQuery: (q) => setStandaloneFilters((prev) => ({ ...prev, query: q })),
      setLocation: (slug) =>
        setStandaloneFilters((prev) => ({ ...prev, location: slug === 'any' ? [] : [slug] })),
      toggleLocation: (slug) =>
        setStandaloneFilters((prev) => ({
          ...prev,
          location: toggleListValue(prev.location, slug),
        })),
      setPropertyType: (type) =>
        setStandaloneFilters((prev) => ({
          ...prev,
          propertyType: type ? [type] : [],
        })),
      togglePropertyType: (type) =>
        setStandaloneFilters((prev) => ({
          ...prev,
          propertyType: toggleListValue(prev.propertyType, type),
        })),
      toggleStatus: (status) =>
        setStandaloneFilters((prev) => ({
          ...prev,
          statuses: toggleListValue(prev.statuses, status),
        })),
      toggleTag: (tag) =>
        setStandaloneFilters((prev) => ({
          ...prev,
          tags: toggleListValue(prev.tags, tag),
        })),
      setMinBedrooms: (bedrooms) =>
        setStandaloneFilters((prev) => ({ ...prev, bedrooms })),
      setMinBathrooms: (bathrooms) =>
        setStandaloneFilters((prev) => ({ ...prev, bathrooms })),
      setPriceBand: (band) =>
        setStandaloneFilters((prev) => ({
          ...prev,
          minPrice: band?.min ?? null,
          maxPrice: band?.max ?? null,
        })),
      removeFilter: (chip) =>
        setStandaloneFilters((prev) => {
          if (chip.field === 'location') {
            return { ...prev, location: prev.location.filter((s) => s !== chip.value) }
          }
          if (chip.field === 'propertyType') {
            return {
              ...prev,
              propertyType: prev.propertyType.filter((t) => t !== chip.value),
            }
          }
          if (chip.field === 'statuses') {
            return {
              ...prev,
              statuses: prev.statuses.filter((s) => s !== chip.value),
            }
          }
          if (chip.field === 'tags') {
            return { ...prev, tags: prev.tags.filter((t) => t !== chip.value) }
          }
          if (chip.field === 'price') {
            return { ...prev, minPrice: null, maxPrice: null }
          }
          if (chip.field === 'bedrooms') {
            return { ...prev, bedrooms: null }
          }
          if (chip.field === 'bathrooms') {
            return { ...prev, bathrooms: null }
          }
          return prev
        }),
      setSort: () => {},
      setPage: () => {},
      reset: () =>
        setStandaloneFilters({
          ...defaultFilters,
          purpose: initialPurpose,
        }),
    }
  }, [
    standaloneFilters,
    standaloneActiveFilters,
    standalonePriceBands,
    standalonePriceBandValue,
    initialPurpose,
  ])

  const effectiveController = externalController ?? standaloneController
  const displayResultCount = externalResultCount ?? standaloneResultCount

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  const handleCommit = useCallback(() => {
    if (onApply) {
      onApply(effectiveController.filters)
      onClose()
      return
    }

    if (!externalController) {
      const params = serialiseQuery(standaloneFilters)
      navigate(`${routes.properties}?${params.toString()}`)
    }
    onClose()
  }, [onApply, effectiveController.filters, externalController, standaloneFilters, navigate, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-[60] bg-ink-900/50 backdrop-blur-xs transition-opacity duration-300 ease-[var(--ease-out-soft)]',
          !isDesktopDrawer && 'lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Sheet Container: Bottom sheet on mobile/small tab, slide-over drawer on desktop if enabled */}
      <div
        ref={panelRef}
        id="property-filter-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Property filters"
        inert={!isOpen}
        data-open={isOpen}
        className={cn(
          // Mobile & Small Tablets (< lg): Bottom sheet sliding up from bottom
          'fixed inset-x-0 bottom-0 z-[60] flex max-h-[88vh] sm:max-h-[85vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-[var(--ease-out-soft)]',
          // Desktop (lg+): Slide-over drawer on right for standalone, or hidden if on properties page
          isDesktopDrawer
            ? 'lg:inset-y-0 lg:right-0 lg:left-auto lg:top-0 lg:h-full lg:max-h-full lg:w-[clamp(28rem,26rem+4vw,32rem)] lg:rounded-none lg:rounded-l-2xl'
            : 'lg:hidden',
          // Animation:
          isOpen
            ? isDesktopDrawer
              ? 'visible translate-y-0 lg:translate-x-0'
              : 'visible translate-y-0'
            : isDesktopDrawer
              ? 'invisible translate-y-full lg:translate-y-0 lg:translate-x-full'
              : 'invisible translate-y-full',
        )}
      >
        {/* Grab handle for bottom sheet on mobile / small tab */}
        <div className="flex shrink-0 items-center justify-center pt-3 pb-1 lg:hidden">
          <div className="h-1.5 w-12 rounded-full bg-sand-300" />
        </div>

        <PropertyFilters
          controller={effectiveController}
          variant="drawer"
          idPrefix="drawer"
          onClose={onClose}
          closeButtonRef={closeButtonRef}
          className="h-full"
        />

        {/* Pinned solid footer with Reset and Show Properties actions */}
        <div className="shrink-0 border-t border-sand-200 bg-white px-5 py-4 pb-6 sm:pb-4 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={effectiveController.reset}
            disabled={effectiveController.activeCount === 0}
            className="shrink-0 text-ink-700"
          >
            <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
            Reset
          </Button>

          <button
            type="button"
            onClick={handleCommit}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-accent-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800"
          >
            Show {displayResultCount.toLocaleString('en-NG')}{' '}
            {displayResultCount === 1 ? 'Property' : 'Properties'}
            <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </>,
    document.body,
  )
}
