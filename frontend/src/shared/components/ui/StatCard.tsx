import { cn } from '@/shared/lib/cn'
import { formatNumber } from '@/shared/lib/format'
import { useCountUp } from '@/shared/hooks/useCountUp'
import { Icon } from '@/shared/components/ui/Icon'
import type { IconName, Stat } from '@/types'

const statIcons: Record<string, IconName> = {
  'stat-properties': 'house',
  'stat-years': 'badge-check',
  'stat-clients': 'users',
}

interface StatCardProps {
  stat: Stat
  /** Counters stay at zero until this flips to true (usually on scroll-in). */
  active?: boolean
  className?: string
}

/**
 * Animated counter card with icon badge, fluid typography, and responsive presentation.
 * Emits `dt`/`dd` so it must be rendered inside a `dl`.
 */
export function StatCard({ stat, active = false, className }: StatCardProps) {
  const value = useCountUp(stat.value, active, { duration: 1400 })
  const icon = statIcons[stat.id] ?? 'sparkles'

  return (
    <div className={cn('flex flex-col items-center text-center sm:items-start sm:text-left', className)}>
      <span className="flex size-7 items-center justify-center rounded-lg bg-tint-100 text-accent-600 sm:size-10 sm:rounded-xl">
        <Icon name={icon} className="size-3.5 sm:size-5" strokeWidth={2} />
      </span>

      <dd className="mt-2 font-display text-[clamp(1.125rem,4.2vw,2.5rem)] font-bold leading-none tracking-tight text-ink-900 sm:mt-3">
        <span>{formatNumber(value)}</span>
        <span className="text-accent-500">{stat.suffix}</span>
      </dd>

      <dt className="mt-1 text-[clamp(0.6875rem,1.8vw,0.875rem)] font-semibold text-ink-800 leading-tight">
        {stat.label}
      </dt>

      <p className="mt-1 hidden text-xs leading-relaxed text-ink-500 md:block sm:mt-1.5 max-w-[14rem]">
        {stat.description}
      </p>
    </div>
  )
}
