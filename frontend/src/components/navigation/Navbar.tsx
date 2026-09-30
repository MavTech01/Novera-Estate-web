import { useState } from 'react'

import { company, navigationCta, primaryNavigation } from '../../data'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { useScrolled } from '../../hooks/useScrolled'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

/**
 * Sticky white navigation: logo left, links centred, orange CTA right.
 * Grows a subtle shadow once the page scrolls.
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isScrolled = useScrolled(16)

  useLockBodyScroll(isMenuOpen)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ease-[var(--ease-out-soft)]',
        isScrolled ? 'shadow-nav' : 'shadow-none',
      )}
    >
      <Container>
        <div className="flex h-20 items-center justify-between gap-6 lg:h-[4.75rem]">
          <a href="/" className="rounded-md transition-opacity duration-200 hover:opacity-80" aria-label={`${company.name} — home`}>
            <Logo />
          </a>

          <nav className="hidden lg:block" aria-label="Primary">
            <NavLinks links={primaryNavigation} className="flex-row items-center gap-8" />
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${company.phoneHref}`}
              className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:text-accent-700 xl:inline-flex"
            >
              <Icon name="phone" className="size-4" strokeWidth={2} />
              {company.phone}
            </a>

            <ButtonLink href={navigationCta.href} variant="primary" size="sm" className="hidden sm:inline-flex">
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
        links={primaryNavigation}
        cta={navigationCta}
        phone={company.phone}
        phoneHref={company.phoneHref}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
