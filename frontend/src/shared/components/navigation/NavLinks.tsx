import { cn } from '@/shared/lib/cn'
import { isHrefActive, normalisePath, splitHref } from '@/shared/lib/router'
import type { NavigationLink } from '@/types'
import { Link } from '@/shared/components/ui/Link'

interface NavLinksProps {
  links: NavigationLink[]
  /** Current location, used to mark the active item. */
  currentPath?: string
  currentQuery?: URLSearchParams
  onNavigate?: () => void
  className?: string
  itemClassName?: string
  tone?: 'dark' | 'light'
  /** Enables the staggered drawer entrance (driven by the parent's open state). */
  animated?: boolean
  /** Ref forwarded to the first link — used to focus the mobile drawer on open. */
  firstItemRef?: React.Ref<HTMLAnchorElement>
}

/** Shared link list used by both the desktop bar and the mobile drawer. */
export function NavLinks({
  links,
  currentPath = '/',
  currentQuery,
  onNavigate,
  className,
  itemClassName,
  tone = 'dark',
  animated = false,
  firstItemRef,
}: NavLinksProps) {
  const query = currentQuery ?? new URLSearchParams()

  // "Rent" refines "/properties", so the plain entry only wins when no refined
  // sibling matches — otherwise two items would light up at once.
  //
  // The sibling scan must skip the link itself: without the index check, a link
  // always finds itself as a matching sibling and unrefined entries such as
  // "/properties" and "/projects" could never take the active state.
  const isRefinedLinkActive = (href: string, index: number) => {
    if (!isHrefActive(href, currentPath, query)) return false

    const linkPath = normalisePath(splitHref(href).path)
    const isRefined = splitHref(href).search !== ''
    if (isRefined) return true

    return !links.some(
      (sibling, siblingIndex) =>
        siblingIndex !== index &&
        normalisePath(splitHref(sibling.href).path) === linkPath &&
        isHrefActive(sibling.href, currentPath, query),
    )
  }

  return (
    <ul className={cn('flex flex-col', className)}>
      {links.map((link, index) => {
        const isActive = isRefinedLinkActive(link.href, index)

        return (
          <li key={link.href} className={cn('relative', animated && 'mobile-nav-item')}>
            <Link
              ref={index === 0 ? firstItemRef : undefined}
              href={link.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex items-center gap-1.5 rounded-md px-1 py-2 text-[0.9375rem] font-medium transition-colors duration-200',
                tone === 'light'
                  ? isActive
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                  : isActive
                    ? 'text-accent-700'
                    : 'text-ink-600 hover:text-accent-600',
                itemClassName,
              )}
            >
              {link.label}
              {!animated && (
                <span
                  className={cn(
                    'absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-pill bg-accent-500 transition-transform duration-300 ease-[var(--ease-out-soft)]',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                  aria-hidden
                />
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
