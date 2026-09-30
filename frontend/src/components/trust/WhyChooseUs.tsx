import { getServiceHighlights } from '../../data'
import type { ServiceHighlight } from '../../types'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'

function TrustFeature({ item }: { item: ServiceHighlight }) {
  return (
    <div className="group flex h-full flex-col rounded-xl bg-white p-7 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:shadow-md">
      <span className="flex size-14 items-center justify-center rounded-pill bg-tint-100 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
        <Icon name={item.icon} className="size-6" strokeWidth={1.75} />
      </span>
      <h3 className="mt-6 font-display text-lg text-ink-900">{item.title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{item.description}</p>
    </div>
  )
}

/** "Why Choose Novera Estates" — three trust cards on a soft orange band. */
export function WhyChooseUs() {
  const highlights = getServiceHighlights()

  return (
    <Section id="why-us" tone="tint" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Why Novera Estates"
          title="Why Choose Us"
          description="Buying or renting property should feel straightforward. We handle the research, the paperwork and the inspection logistics so you can decide with confidence."
          align="center"
        />

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {highlights.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 90} className="flex">
              <TrustFeature item={item} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
