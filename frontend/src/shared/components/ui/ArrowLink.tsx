import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'
import { Link } from './Link'

interface ButtonLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  tone?: 'orange' | 'ink' | 'onBrown'
  size?: 'sm' | 'md'
  withArrow?: boolean
  ariaLabel?: string
}

/** Text link with an arrow that nudges on hover. */
export function ArrowLink({
  href,
  children,
  className,
  tone = 'orange',
  size = 'sm',
  withArrow = true,
  ariaLabel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        'group/arrow inline-flex items-center gap-1.5 font-semibold transition-colors duration-200',
        tone === 'orange' && 'text-accent-600 hover:text-accent-700',
        tone === 'ink' && 'text-ink-900 hover:text-accent-700',
        tone === 'onBrown' && 'text-white hover:text-accent-300',
        size === 'sm' && 'text-sm',
        size === 'md' && 'text-[0.9375rem]',
        className,
      )}
    >
      <span>{children}</span>
      {withArrow && <Icon name="arrow-right" className="arrow-nudge size-4 shrink-0" strokeWidth={2.2} />}
    </Link>
  )
}
