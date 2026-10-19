import { images } from '@/assets/images'
import { company } from '@/data'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'

/** Split closing banner: message on the left, property photograph on the right. */
export function CTASection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-white pb-20 sm:pb-24 lg:pb-28" aria-labelledby="cta-heading">
      <Container>
        <Reveal>
          <div className="grid grid-cols-1 items-stretch overflow-hidden rounded-2xl bg-ink-700 shadow-lg lg:grid-cols-2">
            {/* Copy */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <span className="h-px w-6 bg-accent-300/60" aria-hidden />
                Let’s get started
              </p>

              <h2 id="cta-heading" className="mt-4 text-white">
                Ready to Find Your Next Property?
              </h2>

              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
                Explore our properties or speak with a Novera Estates agent today — we answer every enquiry
                within one working day.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/properties" variant="onBrown" size="lg" withArrow>
                  Explore Properties
                </ButtonLink>
                <ButtonLink
                  href={`tel:${company.phoneHref}`}
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Icon name="phone" className="size-4" strokeWidth={2} />
                  {company.phone}
                </ButtonLink>
              </div>
            </div>

            {/* Photograph */}
            <div className="relative min-h-[16rem] bg-ink-800 lg:min-h-[26rem]">
              <SkeletonImage
                src={images.ui.ctaImage}
                alt="Contemporary Novera Estates residence photographed at dusk"
                width={1600}
                height={1100}
                className="absolute inset-0 size-full"
                imgClassName="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
