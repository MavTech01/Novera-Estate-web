import { PropertyCard } from '@/shared/components/properties/PropertyCard'
import { navigationCta } from '@/data/company'
import { getFeaturedProperties } from '@/data'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { routes } from '@/shared/lib/routes'

/** How many listings to preview before handing over to the full catalogue. */
const PREVIEW_COUNT = 3

/**
 * The bridge between the About page and the Properties feature.
 *
 * Reading about a company is the point at which a visitor decides whether to
 * keep going, so the section answers that with the products themselves rather
 * than another promise. Three listings from the shared catalogue and the two
 * actions that follow them make the next step obvious.
 *
 * `getFeaturedProperties` and `PropertyCard` are reused rather than restyled, so
 * a card here is the same card the homepage and the listing grid show — the
 * comparison a buyer makes across those three pages stays valid.
 */
export function PropertyConnection() {
  const properties = getFeaturedProperties(PREVIEW_COUNT)

  return (
    <Section tone="white">
      <Container>
        <div className="rounded-2xl border border-sand-200 bg-sand-100 px-6 py-12 sm:px-10 sm:py-14 lg:px-14">
          <SectionHeading
            eyebrow="From reading to viewing"
            title="Looking for Your Next Property?"
            description="Explore available properties across different locations and property types, then arrange a viewing for anything that looks right."
            align="center"
          />

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={routes.properties} size="lg" withArrow>
              Browse Properties
            </ButtonLink>
            <ButtonLink href={navigationCta.href} variant="outline" size="lg">
              Book an Inspection
            </ButtonLink>
          </div>
        </div>

        {properties.length > 0 && (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {properties.map((property, index) => (
              <li key={property.id} className="flex">
                <Reveal delay={(index % 3) * 90} className="flex w-full">
                  <PropertyCard property={property} index={index} className="w-full" />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  )
}