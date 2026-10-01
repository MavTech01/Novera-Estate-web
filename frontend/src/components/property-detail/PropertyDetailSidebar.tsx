import { cn } from '@/shared/lib/cn'
import type { PropertyDetail } from '@/types'
import { InspectionCTA } from './InspectionCTA'
import { PropertyActions } from './PropertyActions'
import { PropertyAgentCard } from './PropertyAgentCard'

interface PropertyDetailSidebarProps {
  property: PropertyDetail
  onRequestInspection: () => void
  className?: string
}

/**
 * Contact column for the listing.
 *
 * On desktop it follows the visitor down the page as a sticky rail, so the
 * agent and the inspection prompt stay reachable while they read. On mobile it
 * simply flows into the content, above it, with the sticky bar providing the
 * persistent actions.
 */
export function PropertyDetailSidebar({ property, onRequestInspection, className }: PropertyDetailSidebarProps) {
  return (
    <aside className={cn('min-w-0 lg:sticky lg:top-28', className)} aria-label="Contact and inspection">
      <div className="space-y-4 lg:space-y-5">
        <PropertyActions property={property} onRequestInspection={onRequestInspection} />

        <PropertyAgentCard agent={property.agent} property={property} />

        <InspectionCTA
          propertyTitle={property.title}
          onRequestInspection={onRequestInspection}
        />
      </div>
    </aside>
  )
}
