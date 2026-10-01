import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { locationFactors } from '@/features/locations/data/locationOptions'

/**
 * "Why Location Matters" — the factors a buyer weighs up before a property.
 *
 * The copy is deliberately general and informational. It explains what a
 * location *is*, and makes no claim about value, returns or appreciation: a page
 * about areas has no business implying that choosing one will make anyone money.
 */
export function WhyLocationMatters() {
  return (
    <Section id="why-location" tone="white">
      <Container>
        <SectionHeading
          id="why-location-heading"
          eyebrow="Choosing an area"
          title="Why Location Matters"
          description="The same property can feel completely different in a different part of the city. These are the factors buyers tell us matter most — worth weighing up before you view, not after."
          align="center"
        />

        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-12">
          {locationFactors.map((factor, index) => (
            <li key={factor.id}>
              <Reveal delay={index * 70} className="group flex h-full flex-col">
                <span className="flex size-12 items-center justify-center rounded-xl bg-tint-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                  <Icon name={factor.icon} className="size-6" strokeWidth={1.75} />
                </span>

                <h3 className="mt-5 font-display text-lg text-ink-900">{factor.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{factor.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm leading-relaxed text-ink-400">
          Demand for an area tends to follow jobs, schools and infrastructure, but every street and every estate
          is different. Ask an agent what is actually letting and selling nearby — that is more reliable than any
          general description of a district.
        </p>
      </Container>
    </Section>
  )
}
