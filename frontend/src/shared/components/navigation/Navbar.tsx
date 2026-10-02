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
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import type { NavigationLink } from '@/types'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { NavMenu } from './NavMenu'

interface NavPlainLinkProps {
  link: NavigationLink
  isActive: boolean
}

/** A top-level link with the shared active underline. */
function NavPlainLink({ link, isActive }: NavPlainLinkProps) {
  return (
    <li className="relative">
      <Link
        to={link.href}
        className={cn(
          'relative flex items-center whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200 min-[1200px]:px-3 min-[1200px]:text-[0.9375rem]',
          isActive ? 'text-accent-700' : 'text-ink-600 hover:text-accent-600',
        )}
      >
        {link.label}
        <span
          aria-hidden
          className={cn(
            'absolute -bottom-0.5 left-2 right-2 h-0.5 origin-left rounded-pill bg-accent-500 transition-transform duration-300 ease-[var(--ease-out-soft)] min-[1200px]:left-3 min-[1200px]:right-3',
            isActive ? 'scale-x-100' : 'scale-x-0',
          )}
        />
      </Link>
    </li>
  )
}

/**
 * Fixed white navigation: logo left, grouped links centred, phone and orange CTA
 * right. Groups open dropdowns; the whole bar collapses to the drawer below
 * 1024px. A soft shadow appears once the page scrolls.
 *
 * The links sit on a slightly wider rail (1280px) than the page content, which
 * is enough to keep every label on one line while the CTA stays readable.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isScrolled = useScrolled(16)
  const { pathname: path } = useLocation()
  const [query] = useSearchParams()
  const allHrefs = useMemo(() => collectNavigationHrefs(primaryNavigation), [])

  useLockBodyScroll(isMenuOpen)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ease-[var(--ease-out-soft)]',
        isScrolled ? 'shadow-nav' : 'shadow-none',
      )}
    >
      <Container width="nav">
        <div className="flex h-18 items-center justify-between gap-4 lg:h-20">
          <Link
            to="/"
            className="shrink-0 rounded-md transition-opacity duration-200 hover:opacity-80"
            aria-label={`${company.name} — home`}
          >
            <Logo />
          </Link>

          <nav className="hidden lg:block" aria-label="Primary">
            <ul className="flex items-center gap-1 min-[1200px]:gap-2">
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href={`tel:${company.phoneHref}`}
              className="hidden items-center gap-2 whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:text-accent-700 lg:inline-flex min-[1200px]:px-3"
              aria-label={`Call ${company.phone}`}
            >
              <Icon name="phone" className="size-4" strokeWidth={2} />
              <span className="hidden min-[1200px]:inline">{company.phone}</span>
            </a>

            <ButtonLink
              href={navigationCta.href}
              variant="primary"
              size="sm"
              className="hidden whitespace-nowrap px-4 sm:inline-flex min-[1200px]:px-5"
            >
              {navigationCta.label}
            </ButtonLink>

            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex size-11 items-center justify-center rounded-md border border-sand-200 text-ink-900 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700 lg:hidden"
            >
              <Icon name={isMenuOpen ? 'close' : 'menu'} className="size-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </Container>

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
    </header>
  )
}
