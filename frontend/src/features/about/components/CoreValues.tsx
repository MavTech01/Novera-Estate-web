import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { AboutValue } from '@/features/about/types/aboutTypes'

interface CoreValuesProps {
  values: AboutValue[]
}

/**
 * The values the team works to, as a three-across grid.
 *
 * Each card is an icon, a title and two lines. A value needs to be readable in
 * a few seconds, so anything longer belongs in the story section instead — a
 * grid of paragraphs would stop being scannable, which is the only reason this
 * grid exists.
 */
export function CoreValues({ values }: CoreValuesProps) {
  return (
    <Section tone="tint">
      <Container>
        <SectionHeading
          eyebrow="Core values"
          title="The Standards We Work To"
          description="Six commitments that shape how we describe a property, answer an enquiry and handle a client's details."
          align="center"
        />

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {values.map((value, index) => (
            <li key={value.id} className="flex">
              <Reveal
                delay={(index % 3) * 90}
                className="group flex h-full w-full flex-col rounded-xl border border-sand-200 bg-white p-7 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent-200 hover:shadow-md"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-tint-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                  <Icon name={value.icon} className="size-6" strokeWidth={1.75} />
                </span>

                <h3 className="mt-5 font-display text-lg text-ink-900">{value.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{value.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}