import { useMemo } from 'react'
import { projects } from '@/features/projects/data/projects'
import { projectStatusOptions, projectTypeOptions } from '@/features/projects/data/projectOptions'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import type { ProjectStatusFilter, ProjectTypeFilter } from '@/features/projects/types/projectTypes'
import { Icon } from '@/shared/components/ui/Icon'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'

interface ProjectSearchFormProps {
  controller: ProjectFiltersController
  /** Fired on submit — closes the mobile drawer and brings results into view. */
  onSearch: () => void
  className?: string
}

/**
 * The hero search tool for developments — streamlined pill style.
 *
 * Uses `SearchFilterPill` with live project suggestions and a filter popover
 * for location, project type, and development status.
 */
export function ProjectSearchForm({ controller, onSearch, className }: ProjectSearchFormProps) {
  const { filters, locationOptions, isFiltered, reset, removeFilter } = controller

  const extraFilterCount = [
    Boolean(filters.location),
    Boolean(filters.projectType),
    Boolean(filters.status),
  ].filter(Boolean).length

  const suggestions = useMemo(() => {
    if (!filters.query.trim()) return []
    const q = filters.query.toLowerCase()
    return projects
      .filter((p) => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
      .slice(0, 6)
      .map((p) => ({
        id: p.id,
        label: p.name,
        sublabel: p.location,
      }))
  }, [filters.query])

  const filterContent = (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink-900">Refine Developments</h3>
        {extraFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              removeFilter('location')
              removeFilter('projectType')
              removeFilter('status')
            }}
            className="text-xs font-medium text-accent-600 transition-colors hover:text-accent-800"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="project-filter-location"
            className="text-xs font-medium uppercase tracking-wide text-ink-400"
          >
            Location
          </label>
          <div className="relative">
            <select
              id="project-filter-location"
              value={filters.location}
              onChange={(e) => controller.setLocation(e.target.value)}
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-sand-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-accent-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              <option value="">All Locations</option>
              {locationOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Project Type */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="project-filter-type"
            className="text-xs font-medium uppercase tracking-wide text-ink-400"
          >
            Project Type
          </label>
          <div className="relative">
            <select
              id="project-filter-type"
              value={filters.projectType}
              onChange={(e) => controller.setProjectType(e.target.value as ProjectTypeFilter)}
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-sand-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-accent-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              <option value="">All Types</option>
              {projectTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Project Status */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="project-filter-status"
            className="text-xs font-medium uppercase tracking-wide text-ink-400"
          >
            Status
          </label>
          <div className="relative">
            <select
              id="project-filter-status"
              value={filters.status}
              onChange={(e) => controller.setStatus(e.target.value as ProjectStatusFilter)}
              className="h-11 w-full cursor-pointer appearance-none truncate rounded-lg border border-sand-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-900 transition-colors hover:border-accent-300 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20"
            >
              <option value="">All Statuses</option>
              {projectStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-400"
              strokeWidth={2}
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <SearchFilterPill
      id="projects-search"
      value={filters.query}
      onChange={controller.setQuery}
      onSubmit={onSearch}
      placeholder="Search developments by name or area..."
      ariaLabel="Search developments"
      filterAriaLabel="Toggle development filters"
      showClear={isFiltered}
      onClear={reset}
      activeFilterCount={extraFilterCount}
      filterContent={filterContent}
      suggestions={suggestions}
      onSelectSuggestion={(item) => {
        controller.setQuery(item.label)
        onSearch()
      }}
      noSuggestionsText={
        filters.query.trim().length > 0 ? `No developments match "${filters.query}"` : undefined
      }
      className={className}
    />
  )
}
