import { useState } from 'react'

import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { cn } from '@/shared/lib/cn'
import type { BuyFaqItem } from '@/features/buy/types/buy.types'

interface BuyFaqProps {
  items: readonly BuyFaqItem[]
}

/**
 * Accessible buying FAQ. One question is open at a time — an accordion — and
 * the disclosure states are announced via `aria-expanded`–`aria-controls`.
 */
export function BuyFaq({ items }: BuyFaqProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <Section tone="tint" ariaLabelledBy="buy-faq-heading">
      <Container>
        <SectionHeading
          id="buy-faq-heading"
          eyebrow="Good to know"
          title="Questions Buyers Ask Us"
          description="Straight answers about property purchases, inspections, documentation, and handover."
        />

        <div className="mt-12 mx-auto max-w-3xl">
          {items.map((item, index) => {
            const isOpen = openId === item.id
            const panelId = `buy-faq-panel-${item.id}`
            const buttonId = `buy-faq-button-${item.id}`

            return (
              <Reveal key={item.id} className="flex" delay={index * 50}>
                <div className="mb-4 overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm last:mb-0">
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
                        className={cn('size-4 shrink-0 text-accent-600 transition-transform duration-200', isOpen && 'rotate-180')}
                        strokeWidth={2.2}
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm leading-relaxed text-ink-600">{item.answer}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}