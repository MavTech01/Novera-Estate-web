import { useId, useState } from 'react'

import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyFilterGroupProps {
  title: string
  /** Number of active values, shown as a pill on the heading. */
  count?: number
  /** Collapsible groups keep the sidebar compact on tall filter sets. */
  collapsible?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * One filter section: a heading with an optional count badge and an optional
 * disclosure toggle. The collapsible region uses the `grid-rows` technique so
 * the open/close state animates without hard-coding a height.
 */
export function PropertyFilterGroup({
  title,
  count = 0,
  collapsible = true,
  defaultOpen = true,
  children,
  className,
}: PropertyFilterGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const panelId = useId()
  const headingId = `${panelId}-heading`

  const headingClasses = cn(
    'flex w-full items-center justify-between gap-3 text-left',
    collapsible ? 'min-h-9 cursor-pointer' : 'min-h-9',
  )

  return (
    <section className={cn('border-b border-sand-200 py-4 last:border-b-0 last:pb-0', className)}>
      <h3 id={headingId}>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls={panelId}
            className={cn(headingClasses, 'group rounded-md')}
          >
            <span className="flex items-center gap-2">
              <span className="text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-900">{title}</span>
              {count > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-pill bg-accent-600 px-1.5 py-0.5 text-[0.6875rem] font-bold leading-none text-white">
                  {count}
                  <span className="sr-only"> filters applied</span>
                </span>
              )}
            </span>

            <Icon
              name="chevron-down"
              className={cn(
                'size-4 shrink-0 text-ink-400 transition-transform duration-300 ease-[var(--ease-out-soft)]',
                isOpen && 'rotate-180',
              )}
              strokeWidth={2.2}
            />
          </button>
        ) : (
          <span className={headingClasses}>
            <span className="flex items-center gap-2">
              <span className="text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-ink-900">{title}</span>
              {count > 0 && (
                <span className="inline-flex min-w-5 items-center justify-center rounded-pill bg-accent-600 px-1.5 py-0.5 text-[0.6875rem] font-bold leading-none text-white">
                  {count}
                  <span className="sr-only"> filters applied</span>
                </span>
              )}
            </span>
          </span>
        )}
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className={cn('overflow-hidden', !isOpen && 'invisible')}>
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </section>
  )
}
