import { cn } from '@/shared/lib/cn'
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
      className={cn('hidden lg:sticky lg:top-24 lg:block lg:self-start', className)}
    >
      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm pr-1.5 py-4">
        <div className="custom-scrollbar max-h-[calc(100vh-9.5rem)] overflow-y-auto pl-[clamp(1.25rem,1rem+0.75vw,1.625rem)] pr-2 py-0.5">
          <PropertyFilters controller={controller} variant="sidebar" idPrefix="sidebar" />
        </div>
      </div>
    </aside>
  )
}
