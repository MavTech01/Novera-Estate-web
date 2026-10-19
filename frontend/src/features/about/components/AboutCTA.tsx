import { images } from '@/assets/images'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { routes } from '@/shared/lib/routes'

/**
 * Closing call to action for the About page.
 *
 * The same split composition the homepage uses, with the brand's own tagline
 * as the heading — this is the last thing read before the footer, so it states
 * the promise the whole page has been building towards and offers the two
 * routes out of it.
 *
 * Contact is a button to the enquiry route rather than a phone number in the
 * copy: a number asks the visitor to transcribe digits, and the contact page
 * will carry the full details once it exists.
 */
export function AboutCTA() {
  return (
    <Section tone="white">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl bg-ink-700 shadow-lg lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <span aria-hidden className="h-px w-6 bg-accent-300/60" />
                Let’s get started
              </p>

              <h2 className="mt-4 text-white">Let’s Find a Place That Feels Like Yours.</h2>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                Explore what is currently available, or speak with a Novera Estates agent about what you are
                looking for — budget, location and timeline are a good place to start.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={routes.properties} variant="onBrown" size="lg" withArrow>
                  Explore Properties
                </ButtonLink>
                <ButtonLink
                  href={routes.contact}
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Icon name="message" className="size-4" strokeWidth={2} />
                  Contact Us
                </ButtonLink>
              </div>
            </div>

            <div className="relative min-h-[16rem] bg-ink-800 lg:min-h-[24rem]">
              <SkeletonImage
                src={images.ui.ctaImage}
                alt="A two bedroom house exterior in a residential street in Okokomaiko, Lagos"
                width={1600}
                height={1100}
                className="absolute inset-0 size-full"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}