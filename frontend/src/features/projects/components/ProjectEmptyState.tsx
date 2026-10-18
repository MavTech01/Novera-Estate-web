import { Link } from 'react-router-dom'

import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'

interface ProjectEmptyStateProps {
  onReset: () => void
  /** Optional secondary action, e.g. "Book an Inspection". */
  action?: { label: string; href: string }
  className?: string
}

/**
 * Shown when the current filter combination matches nothing.
 * Always offers a way out — clear the filters, or talk to someone who can
 * search the catalogue manually.
 */
export function ProjectEmptyState({ onReset, action, className }: ProjectEmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-sand-300 bg-tint-50 px-6 py-16 text-center',
        className,
      )}
    >
      <span className="flex size-16 items-center justify-center rounded-pill bg-white text-accent-500 shadow-sm">
        <Icon name="search" className="size-7" strokeWidth={1.75} />
      </span>

      <h3 className="mt-5 font-display text-xl text-ink-900">No projects found</h3>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">
        Try adjusting your search or filters to discover other developments.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800"
        >
          <Icon name="rotate-ccw" className="size-4" strokeWidth={2} />
          Clear Filters
        </button>

        {action && (
          <Link
            to={action.href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-accent-200 bg-white px-6 text-sm font-semibold text-accent-700 transition-colors duration-200 hover:border-accent-400 hover:bg-tint-50"
          >
            {action.label}
            <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />
          </Link>
        )}
      </div>
    </div>
  )
}
