import { cn } from '@/shared/lib/cn'
import { Icon } from './Icon'
import type { IconName } from '@/types'

export type BadgeTone = 'orange' | 'softOrange' | 'success' | 'outline' | 'dark' | 'light'

const tones: Record<BadgeTone, string> = {
  orange: 'bg-accent-600 text-white',
  softOrange: 'bg-tint-100 text-accent-700',
  success: 'bg-success-100 text-success-600',
  outline: 'border border-accent-200 bg-white text-accent-700',
  dark: 'bg-ink-900/80 text-white',
  light: 'bg-white/90 text-ink-700',
}

interface BadgeProps {
  children: React.ReactNode
  tone?: BadgeTone
  icon?: IconName
  className?: string
}

/** Fully rounded pill used for prices, statuses and metadata. */
export function Badge({ children, tone = 'softOrange', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2 py-0.5 text-[0.625rem] font-semibold tracking-[0.01em] sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs',
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} className="size-2.5 sm:size-3.5" strokeWidth={2} />}
      {children}
    </span>
  )
}
