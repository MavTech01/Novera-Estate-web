import { cn } from '@/shared/lib/cn'
import type { Location } from '@/features/locations/types/locationTypes'
import type { LocationMapMetadata } from './locationExplorerData'

interface LocationMapPinProps {
  location: Location
  meta: LocationMapMetadata
  isActive: boolean
  onSelect: (slug: string) => void
}

/**
 * Interactive cartographic map pin with pulsating radar animation when active.
 */
export function LocationMapPin({
  location,
  meta,
  isActive,
  onSelect,
}: LocationMapPinProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
      style={{ left: `${meta.x}%`, top: `${meta.y}%` }}
    >
      {/* Multi-layer Pulse Radar Effect for Active Location */}
      {isActive && (
        <div
          className="pointer-events-none absolute -inset-3 flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Outer pulse wave */}
          <span className="absolute size-14 rounded-full bg-accent-500/25 animate-ping" />
          {/* Mid pulse ripple */}
          <span className="absolute size-9 rounded-full bg-accent-500/40 animate-pulse" />
          {/* Ambient orange glow ring */}
          <span className="absolute size-6 rounded-full bg-accent-400/30 blur-xs" />
        </div>
      )}

      {/* Pin Button */}
      <button
        type="button"
        onClick={() => onSelect(location.slug)}
        aria-label={`Select ${location.name} location`}
        aria-pressed={isActive}
        className={cn(
          'group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold transition-all duration-300 sm:px-3 sm:py-1.5 sm:text-xs',
          isActive
            ? 'z-30 bg-accent-600 text-white shadow-lg shadow-accent-600/40 ring-3 ring-accent-500/30 scale-105'
            : 'z-20 border border-sand-300 bg-white/95 text-ink-800 shadow-sm backdrop-blur-sm hover:border-accent-400 hover:text-accent-700 hover:scale-105',
        )}
      >
        {/* Glowing beacon center dot */}
        <span className="relative flex size-2 items-center justify-center">
          {isActive && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
          )}
          <span
            className={cn(
              'size-1.5 rounded-full',
              isActive ? 'bg-white shadow-[0_0_6px_white]' : 'bg-accent-600',
            )}
          />
        </span>

        <span className="whitespace-nowrap tracking-tight">{location.name}</span>

        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[0.5625rem] font-bold leading-none',
            isActive ? 'bg-white/20 text-white' : 'bg-sand-100 text-ink-500',
          )}
        >
          {location.availableProperties}
        </span>
      </button>
    </div>
  )
}
