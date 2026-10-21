import { Icon } from '@/shared/components/ui/Icon'

interface LocationSuggestionItem {
  id: string
  name: string
}

interface HeroLocationSuggestionsProps {
  locations: LocationSuggestionItem[]
  onSelect: (name: string) => void
}

export function HeroLocationSuggestions({ locations, onSelect }: HeroLocationSuggestionsProps) {
  if (locations.length === 0) return null

  return (
    <ul className="absolute inset-x-0 top-full z-40 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-sand-200 bg-white p-1.5 text-left shadow-xl">
      {locations.slice(0, 6).map((loc) => (
        <li key={loc.id}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(loc.name)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-ink-700 transition-colors hover:bg-tint-50"
          >
            <Icon name="map-pin" className="size-4 shrink-0 text-accent-600" strokeWidth={2} />
            {loc.name}
          </button>
        </li>
      ))}
    </ul>
  )
}
