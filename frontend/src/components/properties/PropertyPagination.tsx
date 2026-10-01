import { buildPageWindow } from '@/shared/lib/propertyQuery'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyPaginationProps {
  page: number
  pageCount: number
  total: number
  onChange: (page: number) => void
  /** Accessible description of the result window, e.g. "7 to 12 of 28 properties". */
  label: string
  className?: string
}

/**
 * Numbered pagination.
 *
 * Shaped around a server-paginated response (`page` / `pageCount` / `total`),
 * so it can be driven straight off `GET /api/properties?page=` later without
 * any change.
 */
export function PropertyPagination({
  page,
  pageCount,
  total,
  onChange,
  label,
  className,
}: PropertyPaginationProps) {
  if (pageCount <= 1) return null

  const pages = buildPageWindow(page, pageCount)

  const goTo = (next: number) => {
    if (next < 1 || next > pageCount || next === page) return
    onChange(next)
  }

  const stepClass =
    'inline-flex min-h-11 items-center gap-1.5 rounded-md border border-sand-200 bg-white px-3.5 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-sand-200 disabled:hover:bg-white disabled:hover:text-ink-600'

  return (
    <nav aria-label="Property results pages" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <li>
          <button type="button" onClick={() => goTo(page - 1)} disabled={page <= 1} className={stepClass}>
            <Icon name="chevron-left" className="size-4" strokeWidth={2.2} />
            Previous
          </button>
        </li>

        {pages.map((entry, index) =>
          entry === null ? (
            <li key={`gap-${index}`} aria-hidden className="px-1 text-sm font-semibold text-ink-400">
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                onClick={() => goTo(entry)}
                aria-current={entry === page ? 'page' : undefined}
                aria-label={`Page ${entry} of ${pageCount}`}
                className={
                  entry === page
                    ? 'inline-flex size-11 items-center justify-center rounded-md bg-accent-600 text-sm font-bold text-white shadow-sm transition-colors duration-200'
                    : 'inline-flex size-11 items-center justify-center rounded-md border border-sand-200 bg-white text-sm font-semibold text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700'
                }
              >
                {entry}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page >= pageCount}
            className={stepClass}
          >
            Next
            <Icon name="chevron-right" className="size-4" strokeWidth={2.2} />
          </button>
        </li>
      </ul>

      <p className="mt-4 text-center text-sm text-ink-500">{label}</p>

      <p className="sr-only" aria-live="polite">
        Page {page} of {pageCount}. {total} properties available.
      </p>
    </nav>
  )
}
