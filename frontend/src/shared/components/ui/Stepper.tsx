import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { useStepperProgress } from '@/shared/hooks/useStepperProgress'
import { cn } from '@/shared/lib/cn'
import type { IconName } from '@/types'
import { Icon } from './Icon'

export interface StepperStep {
  id: string
  /** Short marker rendered in the node, e.g. "01". */
  step: string
  title: string
  description: string
  icon?: IconName
}

interface StepperProps {
  steps: StepperStep[]
  /** Accessible name for the ordered list. */
  ariaLabel?: string
  className?: string
}

type StepState = 'completed' | 'current' | 'upcoming'

/**
 * Numbered process stepper.
 *
 * Vertical rail on the left below `md`; horizontal rail between the node
 * centres from `md` up. Progress is scroll-driven: the step nearest the
 * viewport centre is the single "current" step and takes the filled treatment,
 * earlier steps fall back to a quiet check mark, and each connector segment
 * fills once the step it follows is behind the current one.
 */
export function Stepper({ steps, ariaLabel = 'Process', className }: StepperProps) {
  const count = steps.length
  const progress = useStepperProgress(count)
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <ol
      aria-label={ariaLabel}
      className={cn('relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-7 lg:gap-8', className)}
    >
      {steps.map((step, index) => {
        const isRevealed = progress.isRevealed(index)
        const state: StepState =
          index > progress.activeIndex ? 'upcoming' : index === progress.activeIndex ? 'current' : 'completed'
        // Only `current` takes the filled treatment. `completed` is deliberately
        // quiet: giving finished steps the same fill left two cards looking
        // active at once, which read as a stutter rather than a hand-off.
        const isCurrent = state === 'current'
        const isDone = state === 'completed'
        const isLast = index === count - 1
        /** The segment after this step is orange once this step is behind us. */
        const isSegmentFilled = progress.activeIndex > index

        return (
          <li
            key={step.id}
            data-step-index={index}
            data-revealed={isRevealed}
            ref={progress.registerItem(index)}
            aria-current={state === 'current' ? 'step' : undefined}
            className={cn(
              'relative flex flex-col gap-7 pl-14 md:pl-0 lg:gap-8',
              !prefersReducedMotion && 'stepper-item',
            )}
            style={prefersReducedMotion ? undefined : { transitionDelay: `${index * 120}ms` }}
          >
            {/* Marker at the step's visual centre — the point the focus band
                tracks, so activation follows what the user is looking at. */}
            <span
              aria-hidden
              ref={progress.registerMarker(index)}
              className="pointer-events-none absolute left-1/2 top-1/2 h-px w-px -translate-x-1/2"
            />

            {/* Connector to the next step: vertical below `md`, horizontal above. */}
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'absolute left-5 top-5 w-0.5 -translate-x-1/2 rounded-pill bg-sand-200',
                  // Mobile: run from this node's centre down to the next node's
                  // centre — the 2rem row gap plus the 20px node offset.
                  'bottom-[-3.25rem]',
                  // Desktop: bridge from this node centre to the next one (gap 1.75rem at md, 2rem at lg).
                  'md:bottom-auto md:left-1/2 md:right-[calc(-50%-1.75rem)] md:h-0.5 md:w-auto md:translate-x-0 md:-translate-y-1/2',
                  'lg:right-[calc(-50%-2rem)]',
                )}
              >
                <span
                  className="absolute inset-x-0 top-0 rounded-pill bg-accent-500 transition-[height] duration-700 ease-[var(--ease-out-soft)] md:hidden"
                  style={{ height: isSegmentFilled ? '100%' : '0%' }}
                />
                <span
                  className="absolute inset-y-0 left-0 hidden rounded-pill bg-accent-500 transition-[width] duration-700 ease-[var(--ease-out-soft)] md:block"
                  style={{ width: isSegmentFilled ? '100%' : '0%' }}
                />
              </span>
            )}

            {/* Node — centred above the card on desktop, pinned to the rail on mobile. */}
            <span
              aria-hidden
              className={cn(
                'absolute left-0 top-0 z-10 flex size-10 shrink-0 items-center justify-center rounded-pill',
                'transition-colors duration-300 ease-[var(--ease-out-soft)]',
                'md:relative md:left-auto md:top-auto md:self-center',
                isCurrent
                  ? 'bg-accent-600 text-white'
                  : isDone
                    ? 'border border-accent-200 bg-tint-100 text-accent-600'
                    : 'border border-sand-200 bg-white text-ink-500',
                isCurrent && 'stepper-node-current',
              )}
            >
              {isDone ? (
                <Icon name="check" className="size-5" strokeWidth={2.5} />
              ) : (
                // 20px bold keeps this "large text" for WCAG AA against the orange fill.
                <span className="font-display text-xl font-bold leading-none tracking-[-0.02em]">
                  {step.step}
                </span>
              )}
            </span>

            {/* Card */}
            <div
              className={cn(
                'group flex h-full flex-col rounded-xl border bg-white p-5 sm:p-6',
                'transition-all duration-300 ease-[var(--ease-out-soft)]',
                isCurrent
                  ? 'border-accent-200 shadow-sm hover:-translate-y-1 hover:border-accent-300 hover:shadow-md'
                  : 'border-sand-200 shadow-xs',
              )}
            >
              <div className="flex items-center gap-3">
                {step.icon && (
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-pill transition-colors duration-300',
                      isCurrent ? 'bg-tint-100 text-accent-600' : 'bg-sand-100 text-ink-500',
                    )}
                  >
                    <Icon name={step.icon} className="size-5" strokeWidth={1.75} />
                  </span>
                )}

                <h3
                  className={cn(
                    'font-display text-lg transition-colors duration-300',
                    isCurrent ? 'text-ink-900' : isDone ? 'text-ink-700' : 'text-ink-500',
                  )}
                >
                  {step.title}
                </h3>
              </div>

              <p
                  className={cn(
                    'mt-3 text-sm leading-relaxed transition-colors duration-300',
                    isCurrent ? 'text-ink-600' : 'text-ink-500',
                  )}
              >
                {step.description}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
