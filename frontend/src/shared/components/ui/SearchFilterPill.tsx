import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'
import type { IconName } from '@/types'

export interface SearchFilterPillSuggestion {
  id: string | number
  label: string
  sublabel?: string
  badge?: string | number
}

export interface SearchFilterPillPurposeOption<T extends string = string> {
  value: T
  label: string
}

export interface SearchFilterPillProps<T extends string = string> {
  /** The controlled input search text. */
  value: string
  /** Invoked when typing in the search input. */
  onChange: (value: string) => void
  /** Invoked on form submit or search button click. */
  onSubmit: () => void

  /** Input placeholder string. */
  placeholder?: string
  /** Leading icon name; defaults to `'map-pin'`. */
  leadingIcon?: IconName

  /** Optional purpose chips (e.g., Buy / Rent) rendered above the pill. */
  purpose?: T
  purposeOptions?: readonly SearchFilterPillPurposeOption<T>[]
  onPurposeChange?: (value: T) => void

  /** Autocomplete suggestion items. */
  suggestions?: readonly SearchFilterPillSuggestion[]
  /** Fired when an autocomplete suggestion item is selected. */
  onSelectSuggestion?: (suggestion: SearchFilterPillSuggestion) => void
  /** Text to show when user typed something but no suggestions match. */
  noSuggestionsText?: string

  /** Whether to show the filter trigger button inside the pill. Defaults to `true`. */
  showFilterButton?: boolean
  /** Number of active filters to display in the badge. */
  activeFilterCount?: number
  /** Callback when the filter trigger button is clicked. */
  onFilterToggle?: () => void
  /** External control for whether filter popup/content is open. */
  isFilterOpen?: boolean
  /** Dropdown / popover content to render beneath the pill when filters are open. */
  filterContent?: ReactNode

  /** Whether to show a clear ('x') button inside the input. */
  showClear?: boolean
  /** Callback when the clear button is clicked. */
  onClear?: () => void

  /** Helper / explanatory text below the pill. */
  helperText?: ReactNode

  /** Accessible label for the search form. */
  ariaLabel?: string
  /** Accessible label for the filter button. */
  filterAriaLabel?: string

  /** Can submit form. Defaults to `true`. */
  isValid?: boolean

  /** Root container className. */
  className?: string
  /** Pill form element className. */
  pillClassName?: string
  /** ID for accessibility or anchor scrolling. */
  id?: string
}

/**
 * Reusable, designer-grade search pill with optional:
 * - Segmented purpose chips (Buy / Rent)
 * - Map pin / customizable leading icon
 * - Text search input with clear button
 * - Filter toggle button with active badge
 * - Filter dropdown popover slot
 * - Live autocomplete suggestions dropdown
 * - Search action button
 */
export function SearchFilterPill<T extends string = string>({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search by location (e.g. Lekki, Ikoyi)...',
  leadingIcon = 'map-pin',
  purpose,
  purposeOptions,
  onPurposeChange,
  suggestions = [],
  onSelectSuggestion,
  noSuggestionsText,
  showFilterButton = true,
  activeFilterCount = 0,
  onFilterToggle,
  isFilterOpen: controlledFilterOpen,
  filterContent,
  showClear = false,
  onClear,
  helperText,
  ariaLabel = 'Search properties',
  filterAriaLabel = 'Toggle search filters',
  isValid = true,
  className,
  pillClassName,
  id,
}: SearchFilterPillProps<T>) {
  const [internalFilterOpen, setInternalFilterOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isFilterOpen = controlledFilterOpen !== undefined ? controlledFilterOpen : internalFilterOpen

  // Close suggestions and filter popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        if (controlledFilterOpen === undefined) {
          setInternalFilterOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [controlledFilterOpen])

  const handleFilterClick = () => {
    setShowSuggestions(false)
    if (controlledFilterOpen === undefined) {
      setInternalFilterOpen((prev) => !prev)
    }
    onFilterToggle?.()
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    if (controlledFilterOpen === undefined) {
      setInternalFilterOpen(false)
    }
    if (isValid) {
      onSubmit()
    }
  }

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn('relative mx-auto w-full max-w-xl animate-rise-in', className)}
    >
      {/* Purpose Chips (e.g. Buy / Rent) */}
      {purposeOptions && purposeOptions.length > 0 && (
        <div className="mb-3 flex items-center justify-center gap-2 sm:mb-3.5">
          {purposeOptions.map((opt) => {
            const isActive = purpose === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPurposeChange?.(opt.value)}
                className={cn(
                  'rounded-full px-5 py-1.5 text-xs font-bold transition-all duration-200 sm:text-sm',
                  isActive
                    ? 'bg-accent-600 text-white shadow-md shadow-accent-600/30 hover:bg-accent-700'
                    : 'border border-sand-200/90 bg-white/95 text-ink-700 shadow-sm backdrop-blur-md hover:border-accent-400 hover:text-accent-700',
                )}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Streamlined Rounded-Full Search Pill */}
      <form
        role="search"
        aria-label={ariaLabel}
        onSubmit={handleFormSubmit}
        className={cn(
          'relative flex h-14 items-center rounded-full border border-sand-200/90 bg-white pl-4 pr-1.5 shadow-xl transition-all sm:h-15 sm:pl-5 hover:border-sand-300',
          pillClassName,
        )}
      >
        {/* Leading Icon */}
        <Icon name={leadingIcon} className="size-5 shrink-0 text-ink-400" strokeWidth={2} />

        {/* Input Field */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setShowSuggestions(true)
            if (controlledFilterOpen === undefined) {
              setInternalFilterOpen(false)
            }
          }}
          onFocus={() => {
            setShowSuggestions(true)
            if (controlledFilterOpen === undefined) {
              setInternalFilterOpen(false)
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-ink-900 outline-none placeholder:text-ink-400 sm:text-base"
        />

        {/* Optional Clear Button */}
        {showClear && value.length > 0 && (
          <button
            type="button"
            onClick={() => {
              onClear?.()
              setShowSuggestions(false)
            }}
            aria-label="Clear search"
            className="mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-sand-100 hover:text-ink-700"
          >
            <Icon name="x" className="size-4" strokeWidth={2} />
          </button>
        )}

        {/* Filter Trigger Button */}
        {showFilterButton && (
          <button
            type="button"
            onClick={handleFilterClick}
            aria-label={filterAriaLabel}
            aria-expanded={isFilterOpen}
            className={cn(
              'relative mr-1.5 flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
              activeFilterCount > 0 || isFilterOpen
                ? 'bg-accent-50 text-accent-600 ring-1 ring-accent-400/40'
                : 'text-ink-500 hover:bg-sand-100 hover:text-ink-800',
            )}
          >
            <Icon name="sliders-horizontal" className="size-4" strokeWidth={2} />
            {activeFilterCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent-600 text-[0.625rem] font-bold text-white shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Submit / Search Action Button */}
        <button
          type="submit"
          aria-label={ariaLabel}
          disabled={!isValid}
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full shadow-md transition-all duration-200 sm:size-12',
            isValid
              ? 'bg-accent-600 text-white shadow-accent-600/30 hover:scale-105 hover:bg-accent-700 active:bg-accent-800'
              : 'cursor-not-allowed bg-sand-200 text-ink-400 shadow-none',
          )}
        >
          <Icon name="search" className="size-4 sm:size-5" strokeWidth={2.5} />
        </button>
      </form>

      {/* Helper text */}
      {helperText && (
        <div className="mt-3 text-center text-xs text-ink-500 sm:text-sm">{helperText}</div>
      )}

      {/* Filter Dropdown Popover */}
      {filterContent && isFilterOpen && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border border-sand-200 bg-white p-5 shadow-2xl animate-fade-up sm:p-6">
          {filterContent}
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-50 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-sand-200 bg-white p-1.5 text-left shadow-2xl animate-fade-up">
          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelectSuggestion?.(item)
                  setShowSuggestions(false)
                }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-tint-50 hover:text-accent-700"
              >
                <Icon name={leadingIcon} className="size-4 shrink-0 text-accent-600" strokeWidth={2} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.sublabel && (
                  <span className="text-xs text-ink-400">{item.sublabel}</span>
                )}
                {item.badge !== undefined && (
                  <span className="text-xs text-ink-400">{item.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No matching suggestions hint */}
      {showSuggestions && value.trim().length > 0 && suggestions.length === 0 && noSuggestionsText && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border border-sand-200 bg-white px-5 py-4 text-center shadow-2xl">
          <p className="text-sm text-ink-500">{noSuggestionsText}</p>
        </div>
      )}
    </div>
  )
}
