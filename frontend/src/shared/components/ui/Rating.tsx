import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'

interface RatingProps {
  value: number
  max?: number
  className?: string
  /** Visually hidden context for screen readers. */
  label?: string
}

/** Accessible star rating. */
export function Rating({ value, max = 5, className, label }: RatingProps) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)}>
      <span className="sr-only">{label ?? `Rated ${value} out of ${max}`}</span>
      {Array.from({ length: max }, (_, index) => (
        <Icon
          key={index}
          name="star"
          aria-hidden
          className={cn('size-4', index < value ? 'text-accent-500' : 'text-sand-300')}
          strokeWidth={1.75}
        />
      ))}
    </span>
  )
}
