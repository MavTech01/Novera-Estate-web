import { cn } from '../../lib/cn'
import { formatNumber } from '../../lib/format'
import { useCountUp } from '../../hooks/useCountUp'
import type { Stat } from '../../types'

interface StatCardProps {
  stat: Stat
  /** Counters stay at zero until this flips to true (usually on scroll-in). */
  active?: boolean
  className?: string
}

/**
 * Animated counter. Emits `dt`/`dd` so it must be rendered inside a `dl`.
 */
export function StatCard({ stat, active = false, className }: StatCardProps) {
  const value = useCountUp(stat.value, active, { duration: 1400 })

  return (
    <div className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}>
      <dd className="font-display text-[2.5rem] font-bold leading-none tracking-[-0.03em] text-ink-900 sm:text-[2.75rem]">
        <span>{formatNumber(value)}</span>
        <span className="text-accent-500">{stat.suffix}</span>
      </dd>
      <dt className="text-sm font-semibold text-ink-900">{stat.label}</dt>
      <p className="hidden text-sm leading-relaxed text-ink-500 sm:block">{stat.description}</p>
    </div>
  )
}
