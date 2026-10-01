import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { BuyerGuidanceCard } from '@/features/buy/types/buy.types'

interface BuyerGuidanceProps {
  cards: readonly BuyerGuidanceCard[]
}

/**
 * "What To Consider Before Buying" — informational only. The closing line keeps
 * that distinction explicit: these are things to weigh up, not advice we give.
 */
export function BuyerGuidance({ cards }: BuyerGuidanceProps) {
  return (
    <Section tone="white" ariaLabelledBy="buy-guidance-heading">
      <Container>
        <SectionHeading
          id="buy-guidance-heading"
          eyebrow="Before you decide"
          title="What To Consider Before Buying"
          description="A checklist your future self will thank you for — the things that matter once the excitement of the search has passed."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal key={card.id} className="flex" delay={index * 80}>
              <article className="flex h-full w-full flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
                <span className="flex size-11 items-center justify-center rounded-pill bg-accent-600 text-white">
                  <Icon name={card.icon} className="size-5" strokeWidth={2} />
                </span>

                <h3 className="mt-5 font-display text-lg font-bold text-ink-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{card.description}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 flex items-start gap-2 text-sm leading-relaxed text-ink-400">
            <Icon name="badge-check" className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
            <span>
              This is guidance to consider for yourself — not legal, financial or tax advice from
              Novera Estates, who are not a firm of solicitors. We will gladly point you to the
              professionals who advise on each of these.
            </span>
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}