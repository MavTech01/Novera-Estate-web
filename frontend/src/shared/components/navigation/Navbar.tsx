import { useMemo, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'

import { company, navigationCta, primaryNavigation } from '@/data'
import { useLockBodyScroll } from '@/shared/hooks/useLockBodyScroll'
import { useScrolled } from '@/shared/hooks/useScrolled'
import { cn } from '@/shared/lib/cn'
import {
  collectNavigationHrefs,
  isNavigationEntryActive,
  isNavigationLinkActive,
} from '@/shared/lib/navActive'
import { Icon } from '@/shared/components/ui/Icon'
import type { NavigationLink } from '@/types'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { NavMenu } from './NavMenu'

interface NavPlainLinkProps {
  link: NavigationLink
  isActive: boolean
}

/** A top-level link styled as a capsule item. */
function NavPlainLink({ link, isActive }: NavPlainLinkProps) {
  return (
    <li>
      <Link
        to={link.href}
        className={cn(
          'flex items-center whitespace-nowrap px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 min-[1200px]:px-4 min-[1200px]:text-[0.9375rem]',
          isActive
            ? 'text-accent-600 font-bold'
            : 'text-ink-800 hover:text-accent-600',
        )}
      >
        {link.label}
      </Link>
    </li>
  )
}

/**
 * Responsive navigation header:
 * - At page top: Centered floating pill with high-contrast text and crisp brand logo.
 * - On scroll: Smoothly morphs into an edge-to-edge full width sticky nav bar.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isScrolled = useScrolled(20)
  const { pathname: path } = useLocation()
  const [query] = useSearchParams()
  const allHrefs = useMemo(() => collectNavigationHrefs(primaryNavigation), [])

  useLockBodyScroll(isMenuOpen)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-[var(--ease-out-soft)]',
        isScrolled ? 'pt-0 px-0' : 'pt-4 sm:pt-5 lg:pt-6 px-3 sm:px-6',
      )}
    >
      <div
        className={cn(
          'pointer-events-auto flex w-full items-center justify-between bg-white/95 backdrop-blur-md transition-all duration-500 ease-[var(--ease-out-soft)]',
          isScrolled
            ? 'max-w-full rounded-none border-b border-sand-200/90 py-3 px-4 sm:py-3.5 sm:px-8 lg:px-12 shadow-nav'
            : 'max-w-7xl rounded-full border border-sand-200/90 py-3 pl-4 pr-3 sm:py-3.5 sm:pl-5 sm:pr-3.5 lg:pl-6 lg:pr-4 shadow-xl shadow-ink-950/10',
        )}
      >
        {/* Brand Logo with clear contrast and vertical centering */}
        <Link
          to="/"
          className="flex items-center shrink-0 rounded-full transition-opacity duration-200 hover:opacity-85"
          aria-label={`${company.name} — home`}
        >
          <Logo tone="dark" showSubline={true} />
        </Link>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center" aria-label="Primary">
          <ul className="flex items-center gap-1">
            {primaryNavigation.map((entry) =>
              'items' in entry ? (
                <NavMenu
                  key={entry.label}
                  menu={entry}
                  isActive={isNavigationEntryActive(entry, allHrefs, path, query)}
                />
              ) : (
                <NavPlainLink
                  key={entry.href}
                  link={entry}
                  isActive={isNavigationLinkActive(entry.href, allHrefs, path, query)}
                />
              ),
            )}
          </ul>
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Desktop CTA Button — uses global brand button color accent-600 */}
          <Link
            to={navigationCta.href}
            className="hidden whitespace-nowrap rounded-full bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-accent-700 hover:scale-[1.02] active:bg-accent-800 active:scale-95 sm:inline-flex min-[1200px]:px-6"
          >
            {navigationCta.label}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex size-10 items-center justify-center rounded-full border border-sand-300 bg-sand-50/90 text-ink-900 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700 lg:hidden"
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} className="size-5 text-ink-900" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <div className="pointer-events-auto">
        <MobileMenu
          isOpen={isMenuOpen}
          entries={primaryNavigation}
          cta={navigationCta}
          phone={company.phone}
          phoneHref={company.phoneHref}
          currentPath={path}
          currentQuery={query}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  )
}
