import { useMemo } from 'react'
import { projects } from '@/features/projects/data/projects'
import type { ProjectFiltersController } from '@/features/projects/hooks/useProjectFilters'
import { SearchFilterPill } from '@/shared/components/ui/SearchFilterPill'

interface ProjectSearchFormProps {
  controller: ProjectFiltersController
  /** Fired on submit — brings results into view. */
  onSearch: () => void
  /** Fired when clicking the filter button inside the pill — opens the filter bottom sheet / drawer. */
  onOpenFilters?: () => void
  className?: string
}

/**
 * The hero search tool for developments — streamlined pill style.
 *
 * Uses `SearchFilterPill` with live project suggestions and wires the filter
 * trigger button directly to the universal developments filter sheet / drawer.
 */
export function ProjectSearchForm({ controller, onSearch, onOpenFilters, className }: ProjectSearchFormProps) {
  const { filters, isFiltered, reset } = controller

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

  return (
    <SearchFilterPill
      id="projects-search"
      value={filters.query}
      onChange={controller.setQuery}
      onSubmit={onSearch}
      placeholder="Search developments by name or area..."
      ariaLabel="Search developments"
      filterAriaLabel="Open development filters"
      showClear={isFiltered}
      onClear={reset}
      activeFilterCount={extraFilterCount}
      onFilterToggle={onOpenFilters}
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
