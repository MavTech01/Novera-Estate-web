import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import type { IconName } from '../../types'

export interface CtaAction {
  label: string
  href: string
  variant?: 'primary' | 'outline'
  withArrow?: boolean
}

interface CtaBandProps {
  /** Small orange label above the heading. */
  eyebrow: string
  eyebrowIcon?: IconName
  title: string
  description: string
  actions: CtaAction[]
  /** Id applied to the heading so `aria-labelledby` can point at it. */
  headingId: string
  className?: string
}

/**
 * Shared closing conversion band.
 *
 * The listing page and the property detail page close with the same layout, so
 * the markup lives here once and each page supplies its own copy and actions.
 */
export function CtaBand({
  eyebrow,
  eyebrowIcon = 'users',
  title,
  description,
  actions,
  headingId,
  className,
}: CtaBandProps) {
  return (
    <section aria-labelledby={headingId} className={cn('bg-white pb-20 sm:pb-24', className)}>
      <Container>
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-accent-200 bg-tint-50">
            <div className="flex flex-col items-start gap-8 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
              <div className="max-w-xl">
                <p className="flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4 text-accent-700">
                  <Icon name={eyebrowIcon} className="size-4" strokeWidth={2} />
                  {eyebrow}
                </p>

                <h2 id={headingId} className="mt-4 text-ink-900">
                  {title}
                </h2>

                <p className="mt-4 text-base leading-relaxed text-ink-600">{description}</p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
                {actions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={cn(
                      'inline-flex h-14 items-center justify-center gap-2 rounded-md px-8 text-base font-semibold',
                      'transition-all duration-200 ease-[var(--ease-out-soft)]',
                      action.variant === 'outline'
                        ? 'border border-accent-200 bg-white text-accent-700 hover:border-accent-400 hover:bg-tint-50'
                        : 'bg-accent-600 text-white shadow-sm hover:bg-accent-700 hover:shadow-md',
                    )}
                  >
                    {action.label}
                    {action.withArrow && <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
