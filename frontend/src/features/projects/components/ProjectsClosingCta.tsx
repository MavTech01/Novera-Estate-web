import { company } from '@/data/company'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'

/**
 * Closing call to action for the projects page.
 *
 * Routes directly to site inspection booking with a clean curved background design.
 */
export function ProjectsClosingCta() {
  return (
    <Section tone="white" ariaLabelledBy="projects-closing-cta-heading">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-ink-700 px-8 py-12 shadow-xl sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between lg:px-16 lg:py-16">
            {/* Decorative smooth curved architectural rings & warm ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 select-none sm:-right-20 sm:-top-20 lg:-right-16 lg:-top-16"
            >
              {/* Soft luminous ambient warmth */}
              <div className="absolute inset-0 size-80 rounded-full bg-gradient-to-br from-accent-400/25 via-accent-500/10 to-transparent blur-3xl sm:size-96" />

              {/* Concentric curved rings */}
              <div className="relative flex size-80 items-center justify-center sm:size-[26rem] lg:size-[30rem]">
                <div className="absolute size-full rounded-full border border-white/[0.07]" />
                <div className="absolute size-[78%] rounded-full border border-accent-300/[0.14]" />
                <div className="absolute size-[56%] rounded-full border border-accent-400/[0.20]" />
                <div className="absolute size-[34%] rounded-full bg-gradient-to-br from-accent-400/25 to-accent-600/5 blur-sm" />
              </div>
            </div>

            <div className="relative max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <Icon name="calendar-search" className="size-4 text-accent-300" strokeWidth={2} />
                Book a site inspection
              </p>

              <h2
                id="projects-closing-cta-heading"
                className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
              >
                Interested in a Development?
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/75">
                Book an inspection to see our developments first-hand, or speak with a Novera Estates agent
                about availability, floor plans, and payment milestones.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-0 lg:shrink-0">
              <ButtonLink href="/contact?type=inspection" variant="onBrown" size="lg" withArrow>
                Book an Inspection
              </ButtonLink>
              <ButtonLink
                href={`tel:${company.phoneHref}`}
                variant="glassDark"
                size="lg"
              >
                <Icon name="phone" className="size-4 text-accent-300" strokeWidth={2} />
                {company.phone}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
