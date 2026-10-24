import { ButtonLink } from './Button'
import { Container } from './Container'
import { Icon } from './Icon'
import { Reveal } from './Reveal'
import { Section } from './Section'
import type { IconName } from '@/types'

export interface NextStepAction {
  label: string
  href: string
  icon?: IconName
  withArrow?: boolean
}

export interface TakeNextStepCtaProps {
  id?: string
  headingId?: string
  eyebrow?: string
  eyebrowIcon?: IconName
  title: string
  description: string
  primaryAction: NextStepAction
  secondaryAction?: NextStepAction
  className?: string
}

/**
 * Reusable "Take the next step" closing conversion band:
 * - Clean white outer section
 * - High-contrast rounded ink-700 container
 * - Sparkle/icon eyebrow + bold heading + muted description
 * - Primary + secondary button actions
 */
export function TakeNextStepCta({
  id,
  headingId = 'take-next-step-heading',
  eyebrow = 'Take the next step',
  eyebrowIcon = 'sparkles',
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: TakeNextStepCtaProps) {
  return (
    <Section tone="white" ariaLabelledBy={headingId} id={id} className={className}>
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-8 rounded-2xl bg-ink-700 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <div className="max-w-xl">
              <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-300">
                <Icon name={eyebrowIcon} className="size-4" strokeWidth={2} />
                {eyebrow}
              </p>

              <h2 id={headingId} className="mt-4 text-white">
                {title}
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/70">
                {description}
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
              <ButtonLink
                href={primaryAction.href}
                variant="onBrown"
                size="lg"
                withArrow={primaryAction.withArrow}
              >
                {primaryAction.icon && (
                  <Icon name={primaryAction.icon} className="size-4" strokeWidth={2} />
                )}
                {primaryAction.label}
              </ButtonLink>

              {secondaryAction && (
                <ButtonLink
                  href={secondaryAction.href}
                  variant="white"
                  size="lg"
                  className="border border-white/30"
                  withArrow={secondaryAction.withArrow}
                >
                  {secondaryAction.icon && (
                    <Icon name={secondaryAction.icon} className="size-4" strokeWidth={2} />
                  )}
                  {secondaryAction.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
