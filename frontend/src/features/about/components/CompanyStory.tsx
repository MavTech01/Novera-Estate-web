import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { AboutNotice, AboutStory as AboutStoryData } from '@/features/about/types/aboutTypes'

interface CompanyStoryProps {
  story: AboutStoryData
  /** The placeholder disclosure, when the service supplied one. */
  notice?: AboutNotice
}

/**
 * "Our Story" — the narrative behind the company.
 *
 * The copy describes intent rather than chronology: what we set out to do and
 * why. That is a deliberate constraint rather than a shortage of material. A
 * founding year, a founder's name or a timeline of achievements would all be
 * invented, and an invented company history is the one kind of content on this
 * page that cannot be quietly corrected later.
 *
 * So while the history is being written, `story.isPlaceholder` is set and the
 * notice renders directly under the heading. Clear the flag in the CMS response
 * when the real story is published and the disclosure disappears on its own —
 * the section does not need to change shape.
 */
export function CompanyStory({ story, notice }: CompanyStoryProps) {
  const showPlaceholder = story.isPlaceholder && Boolean(notice)

  return (
    <Section tone="tint">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Sticky on desktop so the copy scrolls past a stable photograph,
              which keeps a text-heavy section from feeling formless. */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-2xl shadow-md">
              <SkeletonImage
                src={story.image.src}
                alt={story.image.alt}
                width={1200}
                height={1400}
                className="aspect-[4/5] w-full"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeading eyebrow={story.eyebrow} title={story.title} />

            {showPlaceholder && notice && (
              <p className="mt-7 flex items-start gap-2.5 rounded-md border border-sand-200 bg-white px-4 py-3 text-xs leading-relaxed text-ink-600">
                <Icon name={notice.icon} className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
                <span>{notice.message}</span>
              </p>
            )}

            <div className="mt-7 flex flex-col gap-4">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-[0.9375rem] leading-relaxed text-ink-600">
                  {paragraph}
                </p>
              ))}
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-4 border-t border-sand-200 pt-8 sm:grid-cols-2">
              {story.pillars.map((pillar) => (
                <li key={pillar} className="flex items-start gap-3 text-[0.9375rem] font-medium text-ink-700">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-pill bg-white text-accent-600">
                    <Icon name="check" className="size-3.5" strokeWidth={2.5} />
                  </span>
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}