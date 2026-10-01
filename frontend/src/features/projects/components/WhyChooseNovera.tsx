import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { projectBenefits } from '@/features/projects/data/projectContent'

/**
 * "Why Choose a Novera Development" — the four reasons behind the product.
 *
 * The long-term value block describes a general characteristic of well-planned
 * real estate rather than promising a return, so nothing here reads as a
 * financial guarantee.
 */
export function WhyChooseNovera() {
  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Our approach"
          title="Why Choose a Novera Development?"
          description="Four things we hold to on every site we take on, whatever the size of the scheme."
          align="center"
        />

        <ul className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
          {projectBenefits.map((benefit, index) => (
            <li key={benefit.id}>
              <Reveal
                delay={index * 90}
                className="group flex h-full flex-col rounded-2xl border border-sand-200 bg-white p-7 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-md sm:p-8"
              >
                <span className="flex size-14 items-center justify-center rounded-xl bg-tint-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                  <Icon name={benefit.icon} className="size-7" strokeWidth={1.75} />
                </span>

                <h3 className="mt-6 font-display text-xl text-ink-900">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{benefit.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
