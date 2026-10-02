import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { RentalProcessStep } from '@/features/rent/types/rent.types'

interface RentalProcessProps {
  steps: readonly RentalProcessStep[]
}

/**
 * "Renting Made Simpler" — the four steps, as cards with a connecting rule on
 * desktop. Icons live in the shared set so they render everywhere.
 */
export function RentalProcess({ steps }: RentalProcessProps) {
  return (
    <Section tone="warm" ariaLabelledBy="rent-process-heading">
      <Container>
        <SectionHeading
          id="rent-process-heading"
          eyebrow="How it works"
          title="Renting Made Simpler"
          description="A straightforward path from browsing to moving in — search, shortlist, inspect, then take the next step with confidence."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.id} className="flex" delay={index * 80}>
              <article className="relative flex h-full w-full flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-4 font-display text-5xl font-bold leading-none text-tint-100"
                >
                  {step.step}
                </span>

                <span className="flex size-11 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                  <Icon name={step.icon} className="size-5" strokeWidth={2} />
                </span>

                <h3 className="mt-5 font-display text-lg font-bold text-ink-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
