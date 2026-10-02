import { Link } from 'react-router-dom'
import { truncateMiddle, type BreadcrumbItem } from '@/shared/lib/propertyDetails'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/**
 * Trail above a page heading.
 * The last entry is the current page; entries before it link back up the
 * hierarchy. On narrow screens the entries that carry a long name are shortened
 * so the row never wraps onto a second line under the sticky navbar.
 */
export function PropertyBreadcrumb({ items, className }: PropertyBreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 text-xs font-medium text-ink-400">
        {items.slice(0, -1).map((item) => (
          <li key={item.id} className="flex items-center gap-1.5">
            <Link to={item.href ?? '/'} className="transition-colors duration-200 hover:text-accent-700">
              <span className="sm:hidden">
                {item.truncateAt ? truncateMiddle(item.label, item.truncateAt) : item.label}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
            <Icon name="chevron-right" className="size-3.5 shrink-0" strokeWidth={2} aria-hidden />
          </li>
        ))}

        <li className="min-w-0 truncate text-ink-600" aria-current="page">
          <span className="sm:hidden">
            {truncateMiddle(items[items.length - 1].label, items[items.length - 1].truncateAt ?? 40)}
          </span>
          <span className="hidden sm:inline">{items[items.length - 1].label}</span>
        </li>
      </ol>
    </nav>
  )
}
