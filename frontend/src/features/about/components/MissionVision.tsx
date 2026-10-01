import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { cn } from '@/shared/lib/cn'
import type { AboutPillar } from '@/features/about/types/aboutTypes'

interface MissionVisionProps {
  mission: AboutPillar
  vision: AboutPillar
}

/** One statement card. `emphasis` picks the filled treatment for the mission. */
function PillarCard({ pillar, emphasis }: { pillar: AboutPillar; emphasis: boolean }) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border p-7 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] sm:p-8',
        emphasis
          ? 'border-accent-200 bg-ink-700 hover:-translate-y-1 hover:shadow-lg'
          : 'border-sand-200 bg-white hover:-translate-y-1 hover:border-accent-200 hover:shadow-md',
      )}
    >
      <span
        className={cn(
          'flex size-12 items-center justify-center rounded-xl',
          emphasis ? 'bg-accent-600 text-white' : 'bg-tint-50 text-accent-600',
        )}
      >
        <Icon name={pillar.icon} className="size-6" strokeWidth={1.75} />
      </span>

      <h3 className={cn('mt-6 font-display text-xl', emphasis ? 'text-white' : 'text-ink-900')}>
        {pillar.title}
      </h3>

      <p className={cn('mt-3 leading-relaxed', emphasis ? 'text-white/75' : 'text-ink-600')}>
        {pillar.summary}
      </p>

      <ul
        className={cn(
          'mt-6 flex flex-col gap-3 border-t pt-6',
          emphasis ? 'border-white/15' : 'border-sand-200',
        )}
      >
        {pillar.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm leading-relaxed">
            <span
              className={cn(
                'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-pill',
                emphasis ? 'bg-white/15 text-white' : 'bg-tint-100 text-accent-600',
              )}
            >
              <Icon name="check" className="size-3" strokeWidth={3} />
            </span>
            <span className={emphasis ? 'text-white/80' : 'text-ink-600'}>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

/**
 * Mission and Vision, as two visually distinct cards.
 *
 * They are treated differently on purpose — a dark filled card and a light one —
 * so the two statements read as separate claims rather than one merged blur.
 * Decoration is kept to an icon and a rule: this is a section about what the
 * company says it is for, and ornament would only compete with the copy.
 */
export function MissionVision({ mission, vision }: MissionVisionProps) {
  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Mission & vision"
          title="What We Are Working Towards"
          description="The two statements we hold the business to, in plain terms."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          <Reveal className="flex">
            <PillarCard pillar={mission} emphasis />
          </Reveal>
          <Reveal delay={120} className="flex">
            <PillarCard pillar={vision} emphasis={false} />
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}