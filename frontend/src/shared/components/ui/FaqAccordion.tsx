import { useState } from 'react'

import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'
import { Reveal } from './Reveal'

/** One question in a shared FAQ list. */
export interface FaqItem {
  id: string
  question: string
  answer: string
}

interface FaqAccordionProps {
  items: readonly FaqItem[]
  /**
   * Namespace for the generated `id`s.
   *
   * Required because a page can render more than one accordion — the contact
   * FAQ preview and the full FAQ page, for instance — and two panels sharing an
   * id would break `aria-controls` for the second one.
   */
  idPrefix: string
  /** Question expanded on first paint. Defaults to the first item. */
  defaultOpenId?: string | null
  className?: string
}

/**
 * Accessible FAQ accordion with smooth disclosure animations and clean divider styling.
 *
 * One question is open at a time and the disclosure state is announced through
 * `aria-expanded`–`aria-controls`, so the control works for mouse, keyboard and
 * assistive technology.
 */
export function FaqAccordion({ items, idPrefix, defaultOpenId, className }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId === undefined ? (items[0]?.id ?? null) : defaultOpenId,
  )

  return (
    <div className={cn('border-t border-sand-200', className)}>
      {items.map((item, index) => {
        const isOpen = openId === item.id
        const panelId = `${idPrefix}-panel-${item.id}`
        const buttonId = `${idPrefix}-button-${item.id}`

        return (
          <Reveal key={item.id} delay={index * 40}>
            <div className="border-b border-sand-200">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left text-[0.9375rem] font-semibold leading-snug text-ink-900 transition-colors duration-200 hover:text-accent-700 sm:text-base"
                >
                  {item.question}
                  <span
                    className={cn(
                      'inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
                      isOpen ? 'bg-accent-600 text-white' : 'bg-sand-100 text-ink-500',
                    )}
                  >
                    <Icon
                      name="chevron-down"
                      className={cn(
                        'size-3.5 transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                      strokeWidth={2.5}
                    />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className={cn('overflow-hidden', !isOpen && 'invisible')}>
                  <p className="pb-5 pr-12 text-sm leading-relaxed text-ink-500">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
