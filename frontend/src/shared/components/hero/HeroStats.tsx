import { getStats } from '@/data'
import { formatNumber } from '@/shared/lib/format'
import { cn } from '@/shared/lib/cn'

interface HeroStatsProps {
  className?: string
}

export function HeroStats({ className }: HeroStatsProps) {
  const stats = getStats()

  return (
    <div className={cn('mt-10 sm:mt-12', className)}>
      <dl className="mx-auto grid max-w-lg grid-cols-3 gap-4 text-center sm:gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center">
            <dd className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {stat.value >= 1000
                ? `${(stat.value / 1000).toFixed(1).replace('.0', '')}K`
                : formatNumber(stat.value)}
              {stat.suffix}
            </dd>
            <dt className="mt-1 text-xs font-medium text-white/70 sm:text-sm">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
