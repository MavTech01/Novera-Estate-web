import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { AboutApproachStep } from '@/features/about/types/aboutTypes'

interface OurApproachProps {
  steps: AboutApproachStep[]
}

/**
 * The four-step client journey.
 *
 * Horizontal from `lg` up, vertical below it — the reading order is the same
 * either way, so nothing about the sequence depends on the layout.
 *
 * The connector between steps is a CSS-drawn rule rather than a progress
 * indicator. A shared `Stepper` already handles a scroll-driven version, but it
 * is built around three columns and treats the active step as a moving target;
 * four static stages do not need that, and reusing it would have meant either
 * overriding its grid or leaving the connector out.
 */
export function OurApproach({ steps }: OurApproachProps) {
  return (
    <Section tone="warm">
      <Container>
        <SectionHeading
          eyebrow="Our approach"
          title="How Working With Us Goes"
          description="Four stages, in the same order for every client — whatever you are buying, renting or letting."
          align="center"
        />

        <ol className="mt-14 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1

            return (
              <li key={step.id} className="relative">
                {/*
                  Connector drawn between icon centres — vertical below `lg`,
                  horizontal above it — so the line joins the steps rather than
                  boxing each one in. Both directions are positioned from the
                  icon's centre (`left-7 top-7` on a 56px node) out to where the
                  next node's centre lands, which keeps the join honest however
                  long each description runs.
                */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute bottom-[-4.25rem] left-7 top-7 w-0.5 rounded-pill bg-sand-300 lg:bottom-auto lg:right-[-3.25rem] lg:h-0.5 lg:w-auto"
                  />
                )}

                <Reveal delay={(index % 4) * 90} className="flex h-full flex-col">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-white text-accent-600 shadow-xs">
                    <Icon name={step.icon} className="size-6" strokeWidth={1.75} />
                  </span>

                  <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
                    {step.step}
                  </p>

                  <h3 className="mt-2 font-display text-xl text-ink-900">{step.title}</h3>

                  <p className="mt-3 text-sm leading-relaxed text-ink-600">{step.description}</p>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </Container>
    </Section>
  )
}