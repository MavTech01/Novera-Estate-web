import { Container } from './Container'
import { FaqAccordion, type FaqItem } from './FaqAccordion'
import { Section } from './Section'
import { SectionHeading } from './SectionHeading'

export type { FaqItem }

export interface GoodToKnowSectionProps {
  id?: string
  headingId?: string
  idPrefix?: string
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
  items: readonly FaqItem[]
  defaultOpenId?: string | null
  className?: string
}

/**
 * Reusable "Good to know" FAQ section with:
 * - Clean white background
 * - Responsive 2-column layout on desktop:
 *   - Left: Sticky heading column with eyebrow, title, description, and optional action link
 *   - Right: Sleek border-divider accordion with smooth expand/collapse animations
 */
export function GoodToKnowSection({
  id,
  headingId,
  idPrefix = 'good-to-know',
  eyebrow = 'Good to know',
  title,
  description,
  action,
  items,
  defaultOpenId,
  className,
}: GoodToKnowSectionProps) {
  const resolvedHeadingId = headingId ?? `${idPrefix}-heading`

  return (
    <Section tone="white" ariaLabelledBy={resolvedHeadingId} id={id} className={className}>
      <Container>
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start lg:gap-16 xl:gap-20">
          {/* Left: heading column — sticky on desktop */}
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id={resolvedHeadingId}
              eyebrow={eyebrow}
              title={title}
              description={description}
              action={action}
            />
          </div>

          {/* Right: accordion */}
          <div className="mt-10 lg:mt-0">
            <FaqAccordion
              items={items}
              idPrefix={idPrefix}
              defaultOpenId={defaultOpenId}
            />
          </div>
        </div>
      </Container>
    </Section>
  )
}
