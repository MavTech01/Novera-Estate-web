import { company } from '@/data/company'
import { routes } from '@/shared/lib/routes'
import { buildCallUrl } from '@/shared/lib/contactLinks'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'

/**
 * Where we are.
 *
 * A styled placeholder rather than an embedded map: a real map needs a key, loads
 * a third-party script and starts tracking the visitor, and none of that should
 * be decided by accident inside a contact page. What it does give is a genuine
 * address, the direction to travel and a way to get there now.
 */
export function ContactMapPlaceholder() {
  return (
    <Section tone="white" ariaLabelledBy="contact-map-heading">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Find us"
              title="Visit the Office"
              description="Our office is on Admiralty Way in Lekki Phase 1, a few minutes from the Lekki–Epe expressway. Visits are by appointment, so call ahead and we'll make sure the right person is free."
              align="left"
            />

            <address className="mt-8 not-italic">
              <p className="font-display text-lg text-ink-900">{company.name}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {company.address.line1}
                <br />
                {company.address.line2.trim()}
                <br />
                {company.address.city}, {company.address.state}, Nigeria
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
                <Icon name="clock" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
                {company.hours}
              </p>
            </address>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={buildCallUrl(company.phone)} variant="primary" size="lg">
                <Icon name="phone" className="size-4" strokeWidth={2} />
                {company.phone}
              </ButtonLink>

              <ButtonLink href={routes.locations} variant="outline" size="lg" withArrow>
                Explore Lekki
              </ButtonLink>
            </div>
          </Reveal>

          {/* The map placeholder — deliberately not an embedded map. */}
          <Reveal delay={120} className="lg:col-span-7">
            <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-sand-200 bg-sand-100 p-8 text-center sm:min-h-[26rem]">
              {/* A quiet stand-in for streets, so the panel reads as a map surface. */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, var(--color-sand-200) 1px, transparent 1px), linear-gradient(to bottom, var(--color-sand-200) 1px, transparent 1px)',
                  backgroundSize: '3rem 3rem',
                }}
              />

              <div className="relative flex flex-col items-center">
                <span className="flex size-16 items-center justify-center rounded-pill bg-white text-accent-600 shadow-sm">
                  <Icon name="map-pinned" className="size-8" strokeWidth={1.75} />
                </span>

                <h3 id="contact-map-heading" className="mt-5 font-display text-xl text-ink-900">
                  {company.name}
                </h3>

                <p className="mt-2 text-sm text-ink-500">
                  {company.address.line1}, {company.address.line2.trim()} — {company.address.city},{' '}
                  {company.address.state}
                </p>

                <p className="mt-6 max-w-sm text-xs leading-relaxed text-ink-400">
                  An interactive map will sit here once a map provider is chosen. Until then the
                  address above and a phone call will get you here.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
