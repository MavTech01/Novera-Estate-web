import { useState } from 'react'

import { company, navigationCta, primaryNavigation } from '@/data'
import { useLockBodyScroll } from '@/shared/hooks/useLockBodyScroll'
import { useRouter } from '@/shared/hooks/useRouter'
import { useScrolled } from '@/shared/hooks/useScrolled'
import { cn } from '@/shared/lib/cn'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@/shared/components/ui/Link'
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
  const { path, query } = useRouter()

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
          <Link
            href="/"
            className="rounded-md transition-opacity duration-200 hover:opacity-80"
            aria-label={`${company.name} — home`}
          >
            <Logo />
          </Link>

          <nav className="hidden lg:block" aria-label="Primary">
            <NavLinks
              links={primaryNavigation}
              currentPath={path}
              currentQuery={query}
              // Tighter across the eight items at the point the desktop bar
              // first appears, otherwise the trailing CTA is clipped just above
              // 1040px. The airier spacing returns once there is room for it.
              className="flex-row items-center gap-6 xl:gap-8"
            />
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
        currentPath={path}
        currentQuery={query}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  )
}
