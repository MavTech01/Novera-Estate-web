import { buildBuyLocationHref } from '@/features/buy/utils/buyQuery'
import { routes } from '@/shared/lib/routes'
import { ArrowLink } from '@/shared/components/ui/ArrowLink'
import { Container } from '@/shared/components/ui/Container'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { BuyLocation } from '@/features/buy/types/buy.types'

interface BuyLocationsProps {
  locations: readonly BuyLocation[]
}

/**
 * "Popular Buying Locations" — one card per area, each linking to every sale
 * listing across that area's catalogue slugs via the Locations mapping.
 */
export function BuyLocations({ locations }: BuyLocationsProps) {
  return (
    <Section tone="white" ariaLabelledBy="buy-locations-heading">
      <Container>
        <SectionHeading
          id="buy-locations-heading"
          eyebrow="Popular buying locations"
          title="Find A Home In The Right Neighbourhood"
          description="Lagos is many cities in one. Start with the areas our buyers ask about most, or skip straight to the map on the locations page."
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
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{location.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-sand-200 pt-4">
                    <p className="text-xs font-medium uppercase leading-4 tracking-[0.01em] text-ink-400">
                      {location.forSaleCount} sample {location.forSaleCount === 1 ? 'listing' : 'listings'} for sale
                    </p>
                    <ArrowLink href={buildBuyLocationHref(location)} tone="ink">
                      View listings
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