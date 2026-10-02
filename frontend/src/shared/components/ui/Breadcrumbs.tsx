import { cn } from '@/shared/lib/cn'

import { SmartLink as Link } from './SmartLink'

export interface BreadcrumbItem {
  label: string
  /** Omitted on the final item, which is the page the visitor is already on. */
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  /** `onBrown` sits on dark section backgrounds. */
  tone?: 'default' | 'onBrown'
  className?: string
}

/**
 * Breadcrumb trail.
 *
 * The last item is the current page: it is plain text with `aria-current="page"`
 * rather than a link to itself, so assistive technology and keyboard users are
 * not offered a pointless jump. Separators are decorative and hidden.
 */
export function Breadcrumbs({ items, tone = 'default', className }: BreadcrumbsProps) {
  if (items.length === 0) return null

  const onBrown = tone === 'onBrown'

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={cn(
                    'font-semibold',
                    isLast
                      ? onBrown
                        ? 'text-white'
                        : 'text-ink-900'
                      : onBrown
                        ? 'text-white/60'
                        : 'text-ink-400',
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  // Vertical padding enlarges the hit area to the 24px minimum
                  // in WCAG 2.5.8 without changing the visual rhythm of the trail.
                  className={cn(
                    '-my-1 inline-flex min-h-6 items-center py-1 transition-colors duration-200',
                    onBrown
                      ? 'text-white/60 hover:text-white'
                      : 'text-ink-400 hover:text-accent-700',
                  )}
                >
                  {item.label}
                </Link>
              )}

              {!isLast && (
                <span aria-hidden className={onBrown ? 'text-white/30' : 'text-ink-300'}>
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
