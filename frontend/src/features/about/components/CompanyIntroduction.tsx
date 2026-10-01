import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { AboutIntroduction as AboutIntroductionData } from '@/features/about/types/aboutTypes'

interface CompanyIntroductionProps {
  introduction: AboutIntroductionData
}

/**
 * "Real Estate With People at the Center" — who the company works with and what
 * changes because of it.
 *
 * The audience grid is the honest version of a differentiator claim. Rather
 * than asserting that Novera Estates handles things better than anyone else,
 * the section names the four groups that arrive with different needs and shows
 * what each of them gets — which is checkable, and which the API will return as
 * ordinary CMS copy.
 */
export function CompanyIntroduction({ introduction }: CompanyIntroductionProps) {
  return (
    <Section tone="white">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Media first on mobile: the photograph carries the section, so it
              should not be pushed below three paragraphs on a phone. */}
          <Reveal className="relative order-1 lg:order-1">
            <div
              aria-hidden
              className="blob-orange absolute -bottom-6 -left-6 hidden size-48 rounded-[2.5rem] opacity-30 sm:block"
            />
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-lg">
              <SkeletonImage
                src={introduction.image.src}
                alt={introduction.image.alt}
                width={1200}
                height={900}
                className="aspect-[4/3] w-full"
              />
            </div>

            {/* Secondary card — the one structural promise this page makes. */}
            <div className="relative z-10 mt-4 flex items-start gap-4 rounded-xl border border-sand-200 bg-sand-100 p-5 shadow-sm sm:absolute sm:-bottom-8 sm:-right-4 sm:mt-0 sm:max-w-sm lg:-right-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-white text-accent-600">
                <Icon name={introduction.accent.icon} className="size-5" strokeWidth={2} />
              </span>
              <div>
                <p className="font-display text-base text-ink-900">{introduction.accent.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{introduction.accent.description}</p>
              </div>
            </div>
          </Reveal>

          <div className="order-2 lg:order-2">
            <SectionHeading
              eyebrow={introduction.eyebrow}
              title={introduction.title}
              description={introduction.paragraphs[0]}
            />

            <div className="mt-6 flex flex-col gap-4">
              {introduction.paragraphs.slice(1).map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-[0.9375rem] leading-relaxed text-ink-600">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-5 border-t border-sand-200 pt-8 sm:grid-cols-2">
              {introduction.audiences.map((audience) => (
                <li key={audience.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-tint-50 text-accent-600">
                    <Icon name={audience.icon} className="size-[1.125rem]" strokeWidth={2} />
                  </span>
<div>
                  <p className="font-display text-[0.9375rem] font-semibold text-ink-900">{audience.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{audience.description}</p>
                </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}