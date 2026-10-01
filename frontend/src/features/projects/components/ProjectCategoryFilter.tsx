import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import { projectCategories } from '@/features/projects/data/projectOptions'
import type { ProjectTypeFilter } from '@/features/projects/types/projectTypes'

interface ProjectCategoryFilterProps {
  value: ProjectTypeFilter
  onChange: (value: ProjectTypeFilter) => void
  className?: string
}

/**
 * Category strip below the hero.
 *
 * Built on radiogroup semantics because exactly one category is active at a
 * time — the same pattern the purpose tabs use. It reads and writes the same
 * `projectType` filter as the hero's "Project Type" select, so the two can
 * never fall out of step.
 */
export function ProjectCategoryFilter({ value, onChange, className }: ProjectCategoryFilterProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Filter developments by category"
      className={cn('flex flex-wrap items-center gap-2.5', className)}
    >
      {projectCategories.map((category) => {
        const isActive = category.value === value

        return (
          <button
            key={category.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(category.value)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-pill border px-4 text-sm font-semibold',
              'transition-all duration-200 ease-[var(--ease-out-soft)]',
              isActive
                ? 'border-accent-600 bg-accent-600 text-white shadow-sm'
                : 'border-sand-200 bg-white text-ink-600 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
            )}
          >
            <Icon
              name={category.icon}
              className={cn('size-4 shrink-0', isActive ? 'text-white' : 'text-accent-500')}
              strokeWidth={2}
            />
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
