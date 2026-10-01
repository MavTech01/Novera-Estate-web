import { useId } from 'react'

import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import type { LocationSearchController } from '@/features/locations/hooks/useLocationSearch'

interface LocationSearchProps {
  controller: LocationSearchController
  /**
   * Called on submit. Filtering is already live, so this exists to give
   * keyboard and screen-reader users a normal way to finish with the field and
   * to bring the results into view on mobile, where the field sits well above
   * them.
   */
  onSearch?: () => void
  className?: string
}

/**
 * The hero search field.
 *
 * A real `<form>` with a screen-reader label and a `type="search"` input, so it
 * behaves the way a visitor expects: Enter submits, the platform's clear
 * affordance is available, and the value participates in normal form behaviour.
 */
export function LocationSearch({ controller, onSearch, className }: LocationSearchProps) {
  const { filters, setQuery, reset, hasQuery } = controller
  const inputId = useId()
  const hintId = useId()

  return (
    <form
      role="search"
      aria-label="Search locations"
      className={cn('w-full', className)}
      onSubmit={(event) => {
        event.preventDefault()
        onSearch?.()
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Search by location
      </label>

      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-ink-400 sm:pl-5"
        >
          <Icon name="search" className="size-5" strokeWidth={2} />
        </span>

        <input
          id={inputId}
          type="search"
          value={filters.query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by location..."
          autoComplete="off"
          aria-describedby={hintId}
          className={cn(
            'h-14 w-full rounded-md border border-sand-300 bg-white pl-12 pr-12 text-base text-ink-900 shadow-sm',
            'placeholder:text-ink-400',
            'transition-colors duration-200 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-200',
            'sm:h-16 sm:pl-14 sm:pr-14 sm:text-lg',
            // The platform's own clear button would sit on top of ours.
            '[&::-webkit-search-cancel-button]:appearance-none',
          )}
        />

        {hasQuery && (
          <button
            type="button"
            onClick={reset}
            className={cn(
              'absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink-400',
              'rounded-r-md transition-colors duration-200 hover:text-accent-700',
            )}
          >
            <span className="sr-only">Clear search</span>
            <Icon name="close" className="size-5" strokeWidth={2} />
          </button>
        )}
      </div>

      <p id={hintId} className="sr-only">
        Try Lekki, Ajah, Ikoyi, Ikeja, Victoria Island or Yaba. Results update as you type.
      </p>
    </form>
  )
}
