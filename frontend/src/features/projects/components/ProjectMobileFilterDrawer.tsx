import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'
import { Button } from '@/shared/components/ui/Button'
import { SelectField } from '@/shared/components/ui/SelectField'
import { TextField } from '@/shared/components/ui/TextField'
import { useLockBodyScroll } from '@/shared/hooks/useLockBodyScroll'
import { projectStatusOptions, projectTypeOptions } from '@/features/projects/data/projectOptions'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import type { ProjectStatusFilter, ProjectTypeFilter } from '@/features/projects/types/projectTypes'

interface ProjectMobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  controller: ProjectFiltersController
  /** Called when the visitor confirms, so the page can bring results into view. */
  onApply: () => void
  /** Total matching developments to display in the commit button */
  resultCount?: number
}

/**
 * Developments filter sheet:
 * - On mobile and small tablets (< lg), slides up from the bottom as an iOS-style sheet with grab handle.
 * - On desktop (lg+), slides out as a clean slide-over drawer from the right.
 * - Pinned solid footer with Reset and Live Result Count buttons.
 */
export function ProjectMobileFilterDrawer({
  isOpen,
  onClose,
  controller,
  onApply,
  resultCount,
}: ProjectMobileFilterDrawerProps) {
  const { filters, activeCount, locationOptions, reset } = controller

  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useLockBodyScroll(isOpen)

  // Focus trapping and keyboard management
  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  const handleCommit = useCallback(() => {
    onApply()
    onClose()
  }, [onApply, onClose])

  const total = resultCount ?? 0

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-[60] bg-ink-900/50 backdrop-blur-xs transition-opacity duration-300 ease-[var(--ease-out-soft)]',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Sheet Container: Bottom sheet on mobile/small tab (< lg), slide-over on desktop (lg+) */}
      <div
        ref={panelRef}
        id="project-filter-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Filter Developments"
        inert={!isOpen}
        data-open={isOpen}
        className={cn(
          // Mobile & Small Tablets (< lg): Bottom sheet sliding up from bottom
          'fixed inset-x-0 bottom-0 z-[60] flex max-h-[88vh] sm:max-h-[85vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-[var(--ease-out-soft)]',
          // Desktop (lg+): Slide-over drawer on right
          'lg:inset-y-0 lg:right-0 lg:left-auto lg:top-0 lg:h-full lg:max-h-full lg:w-[clamp(28rem,26rem+4vw,32rem)] lg:rounded-none lg:rounded-l-2xl',
          // Animation
          isOpen
            ? 'visible translate-y-0 lg:translate-x-0'
            : 'invisible translate-y-full lg:translate-y-0 lg:translate-x-full',
        )}
      >
        {/* Grab handle for bottom sheet on mobile / small tab */}
        <div className="flex shrink-0 items-center justify-center pt-3 pb-1 lg:hidden">
          <div className="h-1.5 w-12 rounded-full bg-sand-300" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-sand-200 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-900 sm:text-xl">Filter Developments</h2>
            <p className="mt-0.5 text-xs text-ink-500">Narrow by location, type, or development status</p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="-mr-2 inline-flex size-10 items-center justify-center rounded-md text-ink-500 transition-colors duration-200 hover:bg-tint-50 hover:text-ink-900"
          >
            <Icon name="close" className="size-5" strokeWidth={2} />
            <span className="sr-only">Close filters</span>
          </button>
        </div>

        {/* Scrollable filter controls */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-5">
          <TextField
            id="projects-sheet-query"
            label="Search projects"
            value={filters.query}
            onChange={controller.setQuery}
            placeholder="Search by name or keyword"
            icon="search"
          />

          <SelectField
            id="projects-sheet-location"
            label="Location"
            value={filters.location}
            options={locationOptions}
            onChange={controller.setLocation}
            placeholder="All Locations"
          />

          <SelectField
            id="projects-sheet-type"
            label="Project Type"
            value={filters.projectType}
            options={projectTypeOptions}
            onChange={(value) => controller.setProjectType(value as ProjectTypeFilter)}
          />

          <SelectField
            id="projects-sheet-status"
            label="Project Status"
            value={filters.status}
            options={projectStatusOptions}
            onChange={(value) => controller.setStatus(value as ProjectStatusFilter)}
          />
        </div>

        {/* Pinned solid footer */}
        <div className="shrink-0 border-t border-sand-200 bg-white px-5 py-4 pb-6 sm:pb-4 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={reset}
            disabled={activeCount === 0}
            className="shrink-0 text-ink-700"
          >
            <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
            Reset
          </Button>

          <button
            type="button"
            onClick={handleCommit}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-accent-600 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800"
          >
            Show {total.toLocaleString('en-NG')} {total === 1 ? 'Development' : 'Developments'}
            <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </>
  )
}
