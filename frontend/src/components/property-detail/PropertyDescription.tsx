import { useState } from 'react'

import { cn } from '../../lib/cn'
import { toParagraphs } from '../../lib/propertyDetails'
import { Icon } from '../ui/Icon'

interface PropertyDescriptionProps {
  description: string
  /** Paragraphs shown before "Read more" is offered. */
  collapsedParagraphs?: number
  className?: string
}

/**
 * Full description of the listing.
 * Long copy starts collapsed at the first couple of paragraphs so the page
 * opens on a scannable summary, and expands in place on request.
 */
export function PropertyDescription({
  description,
  collapsedParagraphs = 2,
  className,
}: PropertyDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const paragraphs = toParagraphs(description)
  const isLong = paragraphs.length > collapsedParagraphs

  const visibleParagraphs = isLong && !isExpanded ? paragraphs.slice(0, collapsedParagraphs) : paragraphs

  return (
    <section aria-labelledby="property-description-heading" className={cn('min-w-0', className)}>
      <h2 id="property-description-heading" className="font-display text-xl text-ink-900 sm:text-2xl">
        Property Description
      </h2>

      <div className="mt-4 space-y-4">
        {visibleParagraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-ink-600">
            {paragraph}
          </p>
        ))}
      </div>

      {isLong && (
        <>
          {/* Fades the last visible line into the "Read more" control. */}
          {!isExpanded && <div className="pointer-events-none -mt-10 h-10 bg-gradient-to-b from-transparent to-white" aria-hidden />}

          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-expanded={isExpanded}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600 transition-colors duration-200 hover:text-accent-700"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            <Icon
              name="chevron-down"
              className={cn('size-4 transition-transform duration-300 ease-[var(--ease-out-soft)]', isExpanded && 'rotate-180')}
              strokeWidth={2.2}
            />
          </button>
        </>
      )}
    </section>
  )
}
