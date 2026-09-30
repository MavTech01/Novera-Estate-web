import { getFeaturedDevelopment } from '../../data'
import { formatCurrency } from '../../lib/format'
import { propertyStatusLabels } from '../../lib/labels'
import { Badge } from '../ui/Badge'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { Section } from '../ui/Section'
import { SectionHeading } from '../ui/SectionHeading'
import { DevelopmentSpecs } from './DevelopmentSpecs'

/** Editorial spotlight for the flagship development. */
export function FeaturedDevelopment() {
  const development = getFeaturedDevelopment()

  const specs = [
    { label: 'Starting from', value: formatCurrency(development.startingPrice) },
    { label: 'Available units', value: `${development.availableUnits} units` },
    { label: 'Property type', value: development.propertyType },
    { label: 'Completion', value: development.completionDate },
  ]

  return (
    <Section id="projects" tone="warm" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="Featured development"
          title="Featured Project"
          description="Signature developments we are building and managing across Lagos."
        />

        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm lg:mt-12 lg:grid-cols-2">
          {/* Image */}
          <Reveal className="relative min-h-[18rem] overflow-hidden bg-tint-100 lg:min-h-[32rem]">
            <img
              src={development.images[0].src}
              alt={development.images[0].alt}
              width={1400}
              height={1000}
              loading="lazy"
              decoding="async"
              className="media absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden />

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-3 p-5 sm:p-6">
              <Badge tone="light" icon="map-pin">
                {development.location.label}
              </Badge>
              <Badge tone="orange">{propertyStatusLabels[development.status]}</Badge>
            </div>
          </Reveal>

          {/* Information panel */}
          <Reveal delay={120} className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">
              {development.developer}
            </p>

            <h3 className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
              {development.name}
            </h3>

            <p className="mt-4 text-base leading-relaxed text-ink-500">{development.description}</p>

            <DevelopmentSpecs specs={specs} />

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {development.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <Icon name="badge-check" className="mt-0.5 size-4 shrink-0 text-accent-500" strokeWidth={2} />
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`/projects/${development.slug}`} size="lg" withArrow>
                View Project
              </ButtonLink>
              <ButtonLink href="/contact?type=inspection" variant="outline" size="lg">
                Book an Inspection
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
