import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import type { LocationHighlight } from '@/features/locations/types/locationTypes'

interface LocationHighlightsProps {
  highlights: LocationHighlight[]
  /** Layout density. The featured block uses `3`; a standalone section uses `2`. */
  columns?: 2 | 3
  /** Hides the list entirely when an area has nothing to say. */
  className?: string
}

/**
 * The "key highlights" list for an area.
 *
 * A list, not a grid of cards: these are short factual points about a place, and
 * giving each one a bordered box would give the page twice the visual weight it
 * needs. The icon carries the meaning alongside the text, so the information
 * never depends on recognising the glyph.
 */
export function LocationHighlights({ highlights, columns = 2, className }: LocationHighlightsProps) {
  if (highlights.length === 0) return null

  return (
    <ul
      className={cn(
        'grid gap-x-6 gap-y-4',
        columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
        className,
      )}
    >
      {highlights.map((highlight) => (
        <li key={highlight.id} className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-tint-50 text-accent-600">
            <Icon name={highlight.icon} className="size-5" strokeWidth={2} />
          </span>

          <span className="min-w-0">
            <span className="block text-sm font-semibold text-ink-900">{highlight.title}</span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-500">{highlight.description}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
