import { cn } from '../../lib/cn'
import type { Coordinates } from '../../types'
import { ButtonLink } from '../ui/Button'
import { Icon } from '../ui/Icon'

interface PropertyMapPlaceholderProps {
  locationLabel: string
  coordinates: Coordinates | null
  className?: string
}

/**
 * Stand-in for the interactive map.
 *
 * Deliberately not a real map: no API key, script or third-party embed is
 * loaded in this phase. The container is a drop-in slot — swapping the body for
 * an `<iframe>` or a map component later leaves the section untouched — and it
 * states plainly that an interactive map is not available yet.
 */
export function PropertyMapPlaceholder({ locationLabel, coordinates, className }: PropertyMapPlaceholderProps) {
  const searchHref = coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationLabel)}`

  return (
    <div
      className={cn(
        'relative isolate flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-sand-200 bg-tint-50',
        className,
      )}
    >
      {/* Decorative street grid — a hint of map texture, not actual geography. */}
      <div className="dot-grid absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute inset-0 opacity-70"
        aria-hidden
        style={{
          backgroundImage:
            'linear-gradient(115deg, transparent 42%, rgba(249,115,22,0.16) 42%, rgba(249,115,22,0.16) 45%, transparent 45%), linear-gradient(20deg, transparent 58%, rgba(249,115,22,0.12) 58%, rgba(249,115,22,0.12) 60%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <span className="relative flex size-14 items-center justify-center rounded-pill bg-white text-accent-600 shadow-md">
          <Icon name="map-pin" className="size-6" strokeWidth={1.75} />
          <span className="absolute inset-0 -z-10 animate-pulse-soft rounded-pill bg-accent-200/60" aria-hidden />
        </span>

        <p className="mt-4 font-display text-lg text-ink-900">{locationLabel}</p>

        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-500">
          Interactive map coming soon. In the meantime, our team can share exact directions and arrange a guided
          visit.
        </p>

        <ButtonLink href={searchHref} target="_blank" rel="noreferrer noopener" variant="outline" size="sm" className="mt-5">
          <Icon name="navigation" className="size-4" strokeWidth={2} />
          Open Location in Maps
        </ButtonLink>

        {coordinates && (
          <p className="mt-3 text-xs text-ink-400">
            Approx. {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)} — not a survey-accurate position.
          </p>
        )}
      </div>
    </div>
  )
}
