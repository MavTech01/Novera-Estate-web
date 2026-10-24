import { buildRentCategoryHref } from '@/features/rent/utils/rentQuery'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Badge } from '@/shared/components/ui/Badge'
import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { RentCategory } from '@/features/rent/types/rent.types'

interface RentCategoriesProps {
  categories: readonly RentCategory[]
}

/** What "browse" means for each category, so the CTA reads as a sentence. */
const ctaLabels: Record<RentCategory['propertyType'], string> = {
  house: 'homes',
  apartment: 'apartments',
  luxury: 'luxury residences',
  commercial: 'commercial spaces',
  development: 'new developments',
  land: 'rentals',
}

/** The ways to rent — every card leads to a filtered catalogue on /properties. */
export function RentCategories({ categories }: RentCategoriesProps) {
  return (
    <Section tone="white" ariaLabelledBy="rent-categories-heading" className="pt-14 sm:pt-16">
      <Container>
        <SectionHeading
          id="rent-categories-heading"
          eyebrow="Browse by category"
          title="What Are You Looking To Rent?"
          description="Start broad with our sample categories — each one opens the catalogue filtered to that property type."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const card = (
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative overflow-hidden">
                  <SkeletonImage
                    src={category.image.src}
                    alt={category.image.alt}
                    width={900}
                    height={560}
                    loading="lazy"
                    className="aspect-[3/2] w-full transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute left-4 top-4">
                    <Badge tone="orange" className="shadow-sm">
                      {category.count} sample {category.count === 1 ? 'rental' : 'rentals'}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold text-ink-900">{category.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{category.description}</p>
                  <div className="mt-5">
                    <ArrowLink href={buildRentCategoryHref(category.propertyType)} tone="orange">
                      View {ctaLabels[category.propertyType]}
                    </ArrowLink>
                  </div>
                </div>
              </div>
            )

            return (
              <Reveal key={category.id} className="flex" delay={index * 80}>
                {card}
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
