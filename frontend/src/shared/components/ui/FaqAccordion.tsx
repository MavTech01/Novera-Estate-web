import { useState } from 'react'

import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'

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
 * Accessible FAQ accordion.
 *
 * One question is open at a time and the disclosure state is announced through
 * `aria-expanded`–`aria-controls`, so the control works for mouse, keyboard and
 * assistive technology without any custom key handling. The panel is hidden with
 * the `hidden` attribute rather than unmounted, which keeps the DOM stable
 * across expansions.
 *
 * Shared by the Rent page, the Contact preview and `/faq`, so a question reads
 * the same everywhere it appears.
 */
export function FaqAccordion({ items, idPrefix, defaultOpenId, className }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpenId === undefined ? (items[0]?.id ?? null) : defaultOpenId,
  )

  return (
    <div className={className}>
      {items.map((item) => {
        const isOpen = openId === item.id
        const panelId = `${idPrefix}-panel-${item.id}`
        const buttonId = `${idPrefix}-button-${item.id}`

        return (
          <div
            key={item.id}
            className="mb-4 overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm last:mb-0"
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink-900 transition-colors duration-200 hover:bg-tint-50"
              >
                {item.question}
                <Icon
                  name="chevron-down"
                  className={cn(
                    'size-4 shrink-0 text-accent-600 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                  strokeWidth={2.2}
                />
              </button>
            </h3>

            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="px-5 pb-5">
              <p className="text-sm leading-relaxed text-ink-600">{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
