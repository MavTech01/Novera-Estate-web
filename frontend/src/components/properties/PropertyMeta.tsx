import { cn } from '../../lib/cn'
import { formatArea } from '../../lib/format'
import { Icon } from '../ui/Icon'

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
    <dl className={cn('flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-600', className)}>
      {specs.map((spec) => (
        <div key={spec.label} className="flex items-center gap-1.5">
          <Icon name={spec.icon} className="size-4 text-ink-500" strokeWidth={1.5} />
          <dd className="font-medium">{spec.label}</dd>
        </div>
      ))}
    </dl>
  )
}
