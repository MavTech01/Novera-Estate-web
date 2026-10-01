import { Icon } from '@/shared/components/ui/Icon'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextField } from '@/shared/components/ui/TextField'
import { cn } from '@/shared/lib/cn'
import { projectStatusOptions, projectTypeOptions } from '@/features/projects/data/projectOptions'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import type { ProjectStatusFilter, ProjectTypeFilter } from '@/features/projects/types/projectTypes'

interface ProjectSearchFormProps {
  controller: ProjectFiltersController
  /** Fired on submit — closes the mobile drawer and brings results into view. */
  onSearch: () => void
  className?: string
}

/**
 * The hero search tool: keyword, location, project type and status.
 *
 * Values are live — the grid below updates as the visitor edits — while submit
 * (click or Enter) exists so keyboard users and the mobile drawer still get an
 * explicit "show me the results" step.
 */
export function ProjectSearchForm({ controller, onSearch, className }: ProjectSearchFormProps) {
  const { filters, locationOptions } = controller

  return (
    <div className={cn('animate-rise-in', className)}>
      <form
        role="search"
        aria-label="Search developments"
        onSubmit={(event) => {
          event.preventDefault()
          onSearch()
        }}
        className="rounded-xl border border-sand-200 bg-white p-5 shadow-md sm:p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-end lg:gap-3">
          <TextField
            id="projects-search-query"
            label="Search projects"
            value={filters.query}
            onChange={controller.setQuery}
            placeholder="Search by name or keyword"
            icon="search"
            className="sm:col-span-2 lg:col-span-4"
          />

          <SelectField
            id="projects-search-location"
            label="Location"
            value={filters.location}
            options={locationOptions}
            onChange={controller.setLocation}
            placeholder="All Locations"
            className="lg:col-span-2"
          />

          <SelectField
            id="projects-search-type"
            label="Project Type"
            value={filters.projectType}
            options={projectTypeOptions}
            onChange={(value) => controller.setProjectType(value as ProjectTypeFilter)}
            className="lg:col-span-2"
          />

          <SelectField
            id="projects-search-status"
            label="Project Status"
            value={filters.status}
            options={projectStatusOptions}
            onChange={(value) => controller.setStatus(value as ProjectStatusFilter)}
            className="lg:col-span-2"
          />

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800 lg:col-span-2 lg:h-14"
          >
            <Icon name="search" className="size-4" strokeWidth={2} />
            Search Projects
          </button>
        </div>
      </form>
    </div>
  )
}
