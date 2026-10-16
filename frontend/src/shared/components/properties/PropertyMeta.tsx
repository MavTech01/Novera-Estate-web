import { cn } from '@/shared/lib/cn'
import { formatArea } from '@/shared/lib/format'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyMetaProps {
  bedrooms: number | null
  bathrooms: number | null
  area: number
  className?: string
}

/** Bedrooms / bathrooms / size row shown on every listing card. */
export function PropertyMeta({ bedrooms, bathrooms, area, className }: PropertyMetaProps) {
  const specs = [
    bedrooms !== null ? { icon: 'bed' as const, label: `${bedrooms} Beds` } : null,
    bathrooms !== null ? { icon: 'bath' as const, label: `${bathrooms} Baths` } : null,
    { icon: 'ruler' as const, label: formatArea(area) },
  ].filter((spec): spec is { icon: 'bed' | 'bath' | 'ruler'; label: string } => spec !== null)

  return (
    <dl className={cn('flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[clamp(0.6875rem,1.8vw,0.875rem)] text-ink-600 sm:gap-x-5 sm:gap-y-2', className)}>
      {specs.map((spec) => (
        <div key={spec.label} className="flex items-center gap-1 sm:gap-1.5">
          <Icon name={spec.icon} className="size-3 text-ink-500 sm:size-4" strokeWidth={1.5} />
          <dd className="font-medium">{spec.label}</dd>
        </div>
      ))}
    </dl>
  )
}
