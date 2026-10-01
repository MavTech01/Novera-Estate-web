import { Button } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'

interface SearchResultSummaryProps {
  count: number
  onClear?: () => void
}

/** Result count + reset control shown after a hero search. */
export function SearchResultSummary({ count, onClear }: SearchResultSummaryProps) {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent-200 bg-tint-50 px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-medium text-ink-700">
        <Icon name="search" className="size-4 text-accent-600" strokeWidth={2} />
        {count} {count === 1 ? 'property matches' : 'properties match'} your search
      </p>

      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear} className="text-accent-700 hover:bg-tint-100">
          Clear search
        </Button>
      )}
    </div>
  )
}
