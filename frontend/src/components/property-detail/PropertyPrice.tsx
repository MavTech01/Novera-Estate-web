import { formatPrice } from '@/shared/lib/format'
import { propertyPurposeLabels } from '@/shared/lib/labels'
import { cn } from '@/shared/lib/cn'
import type { Property } from '@/types'

interface PropertyPriceProps {
  property: Property
  className?: string
  size?: 'lg' | 'md'
}

/**
 * Asking price.
 * Kept separate from the header so the same block can be reused in a compact
 * sidebar or a comparison row without duplicating the currency formatting.
 */
export function PropertyPrice({ property, className, size = 'lg' }: PropertyPriceProps) {
  return (
    <div className={className}>
      <p
        className={cn(
          'font-display font-bold leading-none tracking-[-0.03em] text-ink-900',
          size === 'lg' ? 'text-[clamp(1.75rem,3vw,2.25rem)]' : 'text-2xl',
        )}
      >
        {formatPrice(property.price, property.pricePeriod)}
      </p>

      <p className="mt-2 text-[length:var(--text-label)] uppercase leading-4 text-ink-400">
        {propertyPurposeLabels[property.purpose]} price
        {property.pricePeriod ? ' · negotiable on request' : ''}
      </p>
    </div>
  )
}
