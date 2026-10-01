import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import { LOCATION_DEMO_NOTICE } from '@/features/locations/data/locationOptions'

interface LocationDemoNoticeProps {
  className?: string
}

/**
 * States plainly that the areas, counts and developments here are sample data.
 *
 * The page shows figures like "24 properties" for every area, and until the API
 * is connected those are illustrative. Without this notice they would read as
 * live inventory — which is the difference between a demo and a claim. It sits
 * directly above the grid rather than in a legal page, for the same reason the
 * projects page carries one.
 */
export function LocationDemoNotice({ className }: LocationDemoNoticeProps) {
  return (
    <p
      className={cn(
        'flex items-start gap-2.5 rounded-md border border-sand-200 bg-sand-100 px-4 py-3 text-xs leading-relaxed text-ink-600',
        className,
      )}
    >
      <Icon name="file-text" className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
      <span>{LOCATION_DEMO_NOTICE}</span>
    </p>
  )
}
