import { cn } from '../../lib/cn'
import type { NavigationLink } from '../../types'

interface NavLinksProps {
  links: NavigationLink[]
  /** Current path, used to mark the active item. */
  activePath?: string
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
  activePath = '/',
  onNavigate,
  className,
  itemClassName,
  tone = 'dark',
  animated = false,
  firstItemRef,
}: NavLinksProps) {
  return (
    <ul className={cn('flex flex-col', className)}>
      {links.map((link, index) => {
        const isActive = link.href === activePath

        return (
          <li key={link.href} className={cn('relative', animated && 'mobile-nav-item')}>
            <a
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
            </a>
          </li>
        )
      })}
    </ul>
  )
}
