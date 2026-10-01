import { cn } from '@/shared/lib/cn'
import { Reveal } from './Reveal'

interface SectionHeadingProps {
  /** Small orange uppercase label above the heading. */
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'default' | 'onBrown'
  /** Optional element rendered beside the heading (e.g. a CTA link). */
  action?: React.ReactNode
  className?: string
  id?: string
}

/** Repeated section header: orange eyebrow → bold heading → muted paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'default',
  action,
  className,
  id,
}: SectionHeadingProps) {
  const isCentered = align === 'center'
  const isOnBrown = tone === 'onBrown'

  return (
    <Reveal
      className={cn(
        'flex flex-col gap-5',
        isCentered ? 'items-center text-center' : 'items-start',
        action && 'sm:flex-row sm:items-end sm:justify-between sm:gap-8',
        className,
      )}
    >
      <div className={cn('max-w-2xl', isCentered && 'mx-auto')}>
        {eyebrow && (
          <p
            className={cn(
              'mb-3 flex items-center gap-2 text-[length:var(--text-label)] uppercase leading-4',
              isCentered && 'justify-center',
              isOnBrown ? 'text-accent-300' : 'text-accent-600',
            )}
          >
            <span className={cn('h-px w-6', isOnBrown ? 'bg-accent-300/60' : 'bg-accent-300')} aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 id={id} className={cn(isOnBrown ? 'text-white' : 'text-ink-900')}>
          {title}
        </h2>
        {description && (
          <p className={cn('mt-4 text-base leading-relaxed', isOnBrown ? 'text-white/70' : 'text-ink-500')}>
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  )
}
