import { routes } from '@/shared/lib/routes'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'

/** Closing call to action — the last thing on the page, once every section has landed. */
export function BuyFinalCta() {
  return (
    <Section tone="white" ariaLabelledBy="buy-final-cta-heading">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 rounded-2xl bg-ink-700 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <Icon name="sparkles" className="size-4" strokeWidth={2} />
                Take the next step
              </p>

              <h2 id="buy-final-cta-heading" className="mt-4 text-white">
                Your Next Address Could Be Closer Than You Think
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                Browse the full for-sale catalogue, or tell us what you are looking for and let our
                team build the shortlist with you.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink href={routes.properties} variant="onBrown" size="lg" withArrow>
                Browse properties
              </ButtonLink>
              <ButtonLink
                href={routes.contact}
                variant="white"
                size="lg"
                className="border border-white/30"
              >
                <Icon name="message" className="size-4" strokeWidth={2} />
                Talk to our team
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}