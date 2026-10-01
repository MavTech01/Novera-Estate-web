import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { routes } from '@/shared/lib/routes'
import type { AboutReason } from '@/features/about/types/aboutTypes'

interface WhyNoveraProps {
  reasons: AboutReason[]
}

/**
 * Why Novera Estates — the approach, described rather than compared.
 *
 * Every entry is a choice we have made, not a claim that we beat the field.
 * Language like "most trusted" or "market leader" cannot be checked by a
 * visitor and discredits the four honest points beside it, so the copy stays on
 * what we actually do. When the business has published, verifiable evidence for
 * a comparative claim, this section is the right place for it.
 *
 * Laid out as a two-column list so the copy has room to be specific; a card grid
 * here would cap each description at a sentence and lose the detail that makes
 * these worth reading.
 */
export function WhyNovera({ reasons }: WhyNoveraProps) {
  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Why Novera Estates"
          title="How We Work, and Why"
          description="Five things we have built into the way we present, search and communicate about property."
        />

        <ul className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2 lg:gap-x-16">
          {reasons.map((reason, index) => (
            <li key={reason.id} className="flex">
              <Reveal
                delay={(index % 2) * 90}
                className="group flex w-full gap-5 border-t border-sand-200 pt-6"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-tint-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                  <Icon name={reason.icon} className="size-6" strokeWidth={1.75} />
                </span>

                <div>
                  <h3 className="font-display text-lg text-ink-900">{reason.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{reason.description}</p>
                </div>
              </Reveal>
            </li>
          ))}

          {/* The sixth cell closes the two-column grid rather than leaving a
              hole, and turns the list into an action. */}
          <li className="flex md:col-span-2 lg:col-span-1">
            <Reveal delay={90} className="flex w-full">
              <div className="flex w-full flex-col justify-center gap-3 rounded-xl border border-dashed border-sand-300 bg-sand-100 p-6">
                <p className="text-sm leading-relaxed text-ink-600">
                  The easiest way to judge any of this is to look at the listings themselves.
                </p>
                <ArrowLink href={routes.properties} size="md">
                  Browse properties
                </ArrowLink>
              </div>
            </Reveal>
          </li>
        </ul>
      </Container>
    </Section>
  )
}