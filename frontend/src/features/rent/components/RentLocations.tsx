import { buildRentLocationHref } from '@/features/rent/utils/rentQuery'
import { routes } from '@/shared/lib/routes'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { RentLocation } from '@/features/rent/types/rent.types'

interface RentLocationsProps {
  locations: readonly RentLocation[]
}

/**
 * "Explore Rentals by Location" — one card per area, each linking to every
 * rental across that area's catalogue slugs via the Locations mapping.
 *
 * The areas are presented as equal options, not ranked: the copy describes what
 * each area contains rather than steering the visitor toward any one of them.
 */
export function RentLocations({ locations }: RentLocationsProps) {
  return (
    <Section tone="white" ariaLabelledBy="rent-locations-heading">
      <Container>
        <SectionHeading
          id="rent-locations-heading"
          eyebrow="Popular rental locations"
          title="Explore Rentals by Location"
          description="From the island to the mainland, start with the area that fits your commute and your budget — then browse every rental we have there."
          action={
            <ArrowLink href={routes.locations} size="md">
              Explore all locations
            </ArrowLink>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location, index) => (
            <Reveal key={location.slug} className="flex" delay={index * 80}>
              <article className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="relative overflow-hidden">
                  <SkeletonImage
                    src={location.image.src}
                    alt={location.image.alt}
                    width={900}
                    height={560}
                    loading="lazy"
                    className="aspect-[3/2] w-full transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold text-ink-900">{location.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                    Explore rental properties available in {location.name}.
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-sand-200 pt-4">
                    <p className="text-xs font-medium uppercase leading-4 tracking-[0.01em] text-ink-400">
                      {location.forRentCount} sample {location.forRentCount === 1 ? 'rental' : 'rentals'}
                    </p>
                    <ArrowLink href={buildRentLocationHref(location)} tone="ink">
                      View rentals
                    </ArrowLink>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
