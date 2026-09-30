import { getPropertyCategories } from '../../data'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { PropertyTypeCard } from './PropertyTypeCard'

/** "Explore Properties" — browse the catalogue by category. */
export function PropertyTypes() {
  const categories = getPropertyCategories()

  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Browse the catalogue"
          title="Explore Properties"
          description="From first homes to income-generating land, find the property type that fits your plans."
          align="center"
        />

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-12 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Reveal as="li" key={category.id} delay={(index % 3) * 100}>
              <PropertyTypeCard category={category} className="h-full" />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
