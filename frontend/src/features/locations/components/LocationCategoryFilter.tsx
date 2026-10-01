import { useEffect, useRef } from 'react'

import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import { locationCategoryOptions } from '@/features/locations/data/locationOptions'
import type { LocationCategoryValue } from '@/features/locations/types/locationTypes'

interface LocationCategoryFilterProps {
  value: LocationCategoryValue
  onChange: (value: LocationCategoryValue) => void
  className?: string
}

/**
 * Category strip above the grid.
 *
 * Named for what it does rather than for the state it holds, because the filter
 * *type* is already called `LocationFilters` — the same split the Projects
 * feature makes with `ProjectCategoryFilter` and `ProjectFilters`.
 *
 * Built on radiogroup semantics because exactly one category is active at a
 * time. It reads and writes the same `category` value the URL carries, so a
 * deep link arrives with the correct pill already selected.
 *
 * Scrolls horizontally on narrow screens rather than wrapping into a tall stack,
 * which keeps the grid reachable without a long scroll past six pills.
 */
export function LocationCategoryFilter({ value, onChange, className }: LocationCategoryFilterProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  // The rail scrolls on narrow screens, so a deep link such as
  // `/locations?category=luxury` would otherwise select a pill the visitor
  // cannot see. `nearest` keeps it on screen without dragging the page down to
  // it, and horizontal scrolling is suppressed: vertical is what the visitor
  // would want, but it is the horizontal position that actually matters here.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [value])

  return (
    <div
      role="radiogroup"
      aria-label="Filter locations by category"
      className={cn(
        // Bleeds to the screen edge on mobile so the rail reads as scrollable.
        '-mx-5 flex snap-x snap-mandatory items-center gap-2.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0',
        'no-scrollbar',
        className,
      )}
    >
      {locationCategoryOptions.map((category) => {
        const isActive = category.value === value

        return (
          <button
            key={category.value}
            ref={isActive ? activeRef : undefined}
            type="button"
            role="radio"
            aria-checked={isActive}
            title={category.description}
            onClick={() => onChange(category.value)}
            className={cn(
              'inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-pill border px-4 text-sm font-semibold',
              'transition-all duration-200 ease-[var(--ease-out-soft)]',
              isActive
                ? 'border-accent-600 bg-accent-600 text-white shadow-sm'
                : 'border-sand-200 bg-white text-ink-600 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
            )}
          >
            <Icon
              name={category.icon}
              className={cn('size-4 shrink-0', isActive ? 'text-white' : 'text-accent-500')}
              strokeWidth={2}
            />
            <span className="whitespace-nowrap">{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}
