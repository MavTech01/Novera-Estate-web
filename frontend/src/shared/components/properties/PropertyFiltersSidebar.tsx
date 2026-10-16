import type { PropertyFiltersController } from '@/shared/types/propertyFiltersController'
import { PropertyFilters } from './PropertyFilters'

interface PropertyFiltersSidebarProps {
  controller: PropertyFiltersController
  className?: string
}

/**
 * Desktop/tablet filter rail.
 *
 * Hidden below `lg`, where `MobileFilterDrawer` takes over, and sticky so the
 * filters stay reachable while scrolling a long result list. A capped height
 * with its own scroll area stops the rail from growing unbounded as groups
 * expand.
 */
export function PropertyFiltersSidebar({ controller, className }: PropertyFiltersSidebarProps) {
  return (
    <aside
      aria-label="Refine results"
      className={`hidden lg:sticky lg:top-24 lg:block lg:self-start ${className ?? ''}`}
    >
      <div className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm xl:p-6">
        <PropertyFilters controller={controller} variant="sidebar" idPrefix="sidebar" />
      </div>
    </aside>
  )
}
