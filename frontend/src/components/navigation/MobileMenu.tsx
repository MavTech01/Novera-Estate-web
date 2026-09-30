import { useEffect, useRef } from 'react'

import { cn } from '../../lib/cn'
import type { NavigationLink } from '../../types'
import { ButtonLink } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { NavLinks } from './NavLinks'

interface MobileMenuProps {
  isOpen: boolean
  links: NavigationLink[]
  cta: NavigationLink
  onClose: () => void
  phone: string
  phoneHref: string
  currentPath?: string
  currentQuery?: URLSearchParams
}

/** Slide-in navigation drawer for tablet and mobile. */
export function MobileMenu({
  isOpen,
  links,
  cta,
  onClose,
  phone,
  phoneHref,
  currentPath = '/',
  currentQuery,
}: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    firstLinkRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-40 bg-ink-900/40 transition-opacity duration-300 ease-[var(--ease-out-soft)] lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Panel */}
      <div
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        data-nav-drawer
        data-open={isOpen}
        className={cn(
          'fixed inset-y-0 right-0 z-40 flex w-[86%] max-w-sm flex-col bg-white shadow-lg',
          'transition-transform duration-300 ease-[var(--ease-out-soft)] lg:hidden',
          isOpen ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-sand-200 px-5 sm:px-6">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex size-11 items-center justify-center rounded-md border border-sand-200 text-ink-900 transition-colors duration-200 hover:bg-tint-50 hover:text-accent-700"
          >
            <Icon name="close" className="size-5" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6" aria-label="Mobile">
          <NavLinks
            links={links}
            currentPath={currentPath}
            currentQuery={currentQuery}
            onNavigate={onClose}
            animated
            firstItemRef={firstLinkRef}
            itemClassName="py-3.5 text-base font-semibold tracking-[-0.01em]"
            className="divide-y divide-sand-200"
          />

          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href={cta.href} variant="primary" size="lg" className="w-full" onClick={onClose}>
              {cta.label}
            </ButtonLink>

            <a
              href={`tel:${phoneHref}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-sand-200 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:text-accent-700"
            >
              <Icon name="phone" className="size-4" strokeWidth={2} />
              {phone}
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}
