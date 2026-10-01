import { company } from '@/data/company'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { AboutHero as AboutHeroData } from '@/features/about/types/aboutTypes'

interface AboutHeroProps {
  hero: AboutHeroData
}

/**
 * About page hero: the promise, one photograph of a Lagos residential street,
 * and the two actions a visitor is most likely to want next.
 *
 * The layout mirrors the Locations and Projects heroes — copy on one side, image
 * on the other, with the eyebrow and the reassurance line doing the work a
 * statistic row would otherwise do. No metrics appear here on purpose: there is
 * no verified figure to put in them yet, and an invented one would be the first
 * thing a serious buyer discounted.
 *
 * `animate-fade-up` is a one-shot entrance on load rather than a scroll reveal,
 * because the hero is above the fold on arrival and a reveal observer would
 * only delay what the visitor has already come for.
 */
export function AboutHero({ hero }: AboutHeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-sand-100 pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
      aria-labelledby="about-hero-heading"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-sand-200" />
      {/* Soft accent wash, well outside the content column so it reads as
          background rather than as a shape with meaning. */}
      <div
        aria-hidden
        className="blob-orange absolute -right-28 -top-24 hidden size-[26rem] rounded-[4rem] opacity-20 lg:block"
      />

      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-pill bg-white px-4 py-1.5 text-[length:var(--text-label)] uppercase leading-4 text-accent-700 shadow-xs">
              <Icon name="key" className="size-3.5" strokeWidth={2.2} />
              {hero.eyebrow}
            </p>

            <h1 id="about-hero-heading" className="mt-6 text-ink-900">
              {hero.title}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg">
              {hero.description}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={hero.primaryCta.href} size="lg" withArrow>
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="outline" size="lg">
                {hero.secondaryCta.icon && <Icon name={hero.secondaryCta.icon} className="size-4" strokeWidth={2} />}
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>

            {/* Reassurance line: what the company does, stated as capability
                rather than as a claim about scale. */}
            <ul className="mt-10 flex flex-col gap-3 border-t border-sand-200 pt-8 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
              {hero.highlights.map((highlight) => (
                <li key={highlight.id} className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-white text-accent-600 shadow-xs">
                    <Icon name={highlight.icon} className="size-4" strokeWidth={2} />
                  </span>
                  {highlight.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up-slow relative" style={{ animationDelay: '120ms' }}>
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
              <SkeletonImage
                src={hero.image.src}
                alt={hero.image.alt}
                width={1200}
                height={900}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/3] w-full"
              />
            </div>

            {/* Signature strip carrying the brand line the whole site uses. */}
            <div className="relative z-10 mt-5 flex items-center gap-3 rounded-xl border border-sand-200 bg-white p-4 shadow-md lg:absolute lg:-bottom-7 lg:-left-6 lg:mt-0 lg:w-max">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-tint-100 text-accent-600">
                <Icon name="compass" className="size-5" strokeWidth={2} />
              </span>
              <span className="flex flex-col">
                <span className="font-display text-sm font-bold leading-tight text-ink-900">
                  {company.tagline}
                </span>
                <span className="mt-1 text-xs text-ink-500">{company.descriptor}</span>
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}