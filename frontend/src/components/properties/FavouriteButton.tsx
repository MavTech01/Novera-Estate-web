import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'

interface FavouriteButtonProps {
  isFavourite: boolean
  onToggle: () => void
  propertyTitle: string
  className?: string
  /** `solid` for image overlays, `plain` for light surfaces. */
  tone?: 'overlay' | 'plain'
}

/** Save-to-shortlist toggle. */
export function FavouriteButton({
  isFavourite,
  onToggle,
  propertyTitle,
  className,
  tone = 'overlay',
}: FavouriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavourite}
      className={cn(
        'relative z-10 inline-flex size-11 items-center justify-center rounded-pill transition-all duration-200 ease-[var(--ease-out-soft)]',
        tone === 'overlay'
          ? 'bg-white/90 text-ink-700 backdrop-blur-sm hover:bg-white hover:text-accent-600'
          : 'border border-sand-200 text-ink-600 hover:border-accent-300 hover:text-ink-900',
        className,
      )}
    >
      <span className="sr-only">
        {isFavourite ? `Remove ${propertyTitle} from shortlist` : `Save ${propertyTitle} to shortlist`}
      </span>
      <Icon
        name="heart"
        strokeWidth={1.75}
        className={cn('size-[1.15rem] transition-colors duration-200', isFavourite && 'fill-accent-500 text-accent-600')}
      />
    </button>
  )
}
