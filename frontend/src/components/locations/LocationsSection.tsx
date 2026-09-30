import { getFeaturedLocations } from '../../data'
import { cn } from '../../lib/cn'
import { locationPath } from '../../lib/routes'
import type { LocationSummary } from '../../types'
import { ArrowLink } from '../ui/ArrowLink'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { SkeletonImage } from '../ui/SkeletonImage'

function LocationCard({ location }: { location: LocationSummary }) {
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-sand-200 bg-white shadow-sm',
        'transition-all duration-300 ease-[var(--ease-out-soft)]',
        'hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-lg',
        'focus-within:-translate-y-1.5 focus-within:shadow-lg',
      )}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-tint-100">
        <SkeletonImage
          src={location.image.src}
          alt={location.image.alt}
          width={900}
          height={600}
          className="absolute inset-0 size-full"
          imgClassName="media"
        />

        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-pill bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur-sm">
          <Icon name="map-pin" className="size-3.5 text-accent-600" strokeWidth={2} />
          {location.availableProperties} available
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          <a href={locationPath(location.slug)} className="after:absolute after:inset-0 after:content-['']">
            {location.name}
          </a>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{location.description}</p>

        <div className="mt-5 border-t border-sand-200 pt-4">
          <ArrowLink href={locationPath(location.slug)}>View Properties</ArrowLink>
        </div>
      </div>
    </article>
  )
}

/** "Explore Prime Locations" — browse the neighbourhoods we cover. */
export function LocationsSection() {
  const locations = getFeaturedLocations()

  return (
    <Section id="locations" tone="white" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Prime locations"
          title="Explore Prime Locations"
          description="We focus on the neighbourhoods where families, professionals and investors are choosing to settle."
          action={
            <ArrowLink href="/locations" size="md">
              All locations
            </ArrowLink>
          }
        />

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {locations.map((location, index) => (
            <Reveal as="li" key={location.id} delay={(index % 3) * 100} className="flex">
              <LocationCard location={location} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  )
}
