import { getStats } from '@/data'
import { formatNumber } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'
import { useCountUp } from '@/shared/hooks/useCountUp'

interface HeroStatsProps {
  className?: string
}

interface StatCounterProps {
  value: number
  suffix?: string
  delayMs: number
}

function StatCounter({ value, suffix, delayMs }: StatCounterProps) {
  const animatedValue = useCountUp(value, true, { duration: 1600, delay: delayMs })

  const display = animatedValue >= 1000
    ? `${(animatedValue / 1000).toFixed(1).replace('.0', '')}K`
    : formatNumber(animatedValue)

  return (
    <>
      {display}
      {suffix}
    </>
  )
}

export function HeroStats({ className }: HeroStatsProps) {
  const stats = getStats()

  return (
    <div className={cn('mt-6 sm:mt-8', className)}>
      <dl className="mx-auto grid max-w-lg grid-cols-3 gap-2 text-center sm:gap-6 lg:gap-8">
        {stats.map((stat, index) => (
          <div key={stat.id} className="flex flex-col items-center">
            <dd className="font-display text-[clamp(1.35rem,4.5vw,2.25rem)] font-bold tracking-tight text-white leading-tight">
              <StatCounter
                value={stat.value}
                suffix={stat.suffix}
                delayMs={700 + index * 120}
              />
            </dd>
            <dt className="mt-1 text-[clamp(0.625rem,2.2vw,0.875rem)] font-medium text-white/75 whitespace-nowrap tracking-tight sm:tracking-normal">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
