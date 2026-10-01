import { Icon } from '@/shared/components/ui/Icon'
import { Modal } from '@/shared/components/ui/Modal'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextField } from '@/shared/components/ui/TextField'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { projectStatusOptions, projectTypeOptions } from '@/features/projects/data/projectOptions'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import type { ProjectStatusFilter, ProjectTypeFilter } from '@/features/projects/types/projectTypes'

interface ProjectMobileFilterDrawerProps {
  controller: ProjectFiltersController
  /** Called when the visitor confirms, so the page can bring results into view. */
  onApply: () => void
}

/**
 * Filter panel for small screens.
 *
 * Built on the shared `Modal`, which is already a bottom sheet below `sm` and
 * brings focus trapping, Escape-to-close, body scroll lock and focus restore
 * with it — so this component only has to describe the fields.
 *
 * The desktop filter rail stays in the DOM but is hidden with `lg:hidden`, and
 * this sheet is never mounted above that breakpoint. That keeps one set of field
 * `id`s on screen at a time.
 */
export function ProjectMobileFilterDrawer({ controller, onApply }: ProjectMobileFilterDrawerProps) {
  const { isOpen, open, close } = useDisclosure()
  const { filters, activeCount, locationOptions, reset } = controller

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex h-11 items-center gap-2 rounded-md border border-sand-200 bg-white px-4 text-sm font-semibold text-ink-900 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700 lg:hidden"
      >
        <Icon name="sliders-horizontal" className="size-4" strokeWidth={2} />
        Filters
        {activeCount > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-pill bg-accent-600 px-1.5 py-0.5 text-[0.6875rem] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={close}
        title="Filter Developments"
        description="Narrow the catalogue by location, type or status."
      >
        <div className="space-y-4 overflow-y-auto px-6 py-5">
          <TextField
            id="projects-drawer-query"
            label="Search projects"
            value={filters.query}
            onChange={controller.setQuery}
            placeholder="Search by name or keyword"
            icon="search"
          />

          <SelectField
            id="projects-drawer-location"
            label="Location"
            value={filters.location}
            options={locationOptions}
            onChange={controller.setLocation}
            placeholder="All Locations"
          />

          <SelectField
            id="projects-drawer-type"
            label="Project Type"
            value={filters.projectType}
            options={projectTypeOptions}
            onChange={(value) => controller.setProjectType(value as ProjectTypeFilter)}
          />

          <SelectField
            id="projects-drawer-status"
            label="Project Status"
            value={filters.status}
            options={projectStatusOptions}
            onChange={(value) => controller.setStatus(value as ProjectStatusFilter)}
          />
        </div>

        <div className="flex gap-3 border-t border-sand-200 px-6 py-5">
          <button
            type="button"
            onClick={reset}
            disabled={activeCount === 0}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-sand-200 bg-white text-sm font-semibold text-ink-700 transition-colors hover:border-accent-300 hover:bg-tint-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => {
              onApply()
              close()
            }}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-md bg-accent-600 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-700 active:bg-accent-800"
          >
            Show Results
          </button>
        </div>
      </Modal>
    </>
  )
}