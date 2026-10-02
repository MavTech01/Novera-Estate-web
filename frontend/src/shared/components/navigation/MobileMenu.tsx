import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'
import {
  collectNavigationHrefs,
  isNavigationEntryActive,
  isNavigationLinkActive,
} from '@/shared/lib/navActive'
import type { NavigationEntry, NavigationLink, NavigationMenu } from '@/types'
import { ButtonLink } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'

interface MobileMenuProps {
  isOpen: boolean
  entries: NavigationEntry[]
  cta: NavigationLink
  onClose: () => void
  phone: string
  phoneHref: string
  currentPath?: string
  currentQuery?: URLSearchParams
}

interface RowProps {
  isActive: boolean
  firstFocusRef?: React.Ref<HTMLAnchorElement | HTMLButtonElement>
}

function MobileLinkRow({
  link,
  isActive,
  onClose,
  firstFocusRef,
}: RowProps & { link: NavigationLink; onClose: () => void }) {
  return (
    <li className="mobile-nav-item border-b border-sand-200">
      <Link
        ref={firstFocusRef as React.Ref<HTMLAnchorElement>}
        to={link.href}
        onClick={onClose}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'flex min-h-14 items-center py-3.5 text-base font-semibold tracking-[-0.01em] transition-colors duration-200',
          isActive ? 'text-accent-700' : 'text-ink-700 hover:text-accent-600',
        )}
      >
        {link.label}
      </Link>
    </li>
  )
}

function MobileAccordion({
  menu,
  isActive,
  isOpen,
  onToggle,
  allHrefs,
  currentPath,
  currentQuery,
  onClose,
  firstFocusRef,
}: RowProps & {
  menu: NavigationMenu
  isOpen: boolean
  onToggle: () => void
  allHrefs: readonly string[]
  currentPath: string
  currentQuery: URLSearchParams
  onClose: () => void
}) {
  const panelId = useId()

  return (
    <li className="mobile-nav-item border-b border-sand-200">
      <button
        ref={firstFocusRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          'flex min-h-14 w-full items-center justify-between py-3.5 text-left text-base font-semibold tracking-[-0.01em] transition-colors duration-200',
          isActive ? 'text-accent-700' : 'text-ink-700 hover:text-accent-600',
        )}
      >
        {menu.label}
        <Icon
          name="chevron-down"
          className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-180')}
          strokeWidth={2.4}
        />
      </button>

      {/* Grid-rows expansion animates to the content's natural height without
          measuring it in JavaScript. */}
      <div
        id={panelId}
        className={cn(
          'grid transition-all duration-300 ease-[var(--ease-out-soft)]',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <ul className="overflow-hidden">
          {menu.items.map((item) => {
            const itemActive = isNavigationLinkActive(item.href, allHrefs, currentPath, currentQuery)

            return (
              <li key={`${item.label}-${item.href}`}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  aria-current={itemActive ? 'page' : undefined}
                  className="flex items-start gap-3 py-3 pl-1 transition-colors duration-200 hover:bg-tint-50"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-tint-50 text-accent-600">
                    {item.icon && <Icon name={item.icon} className="size-4" strokeWidth={2} />}
                  </span>
                  <span className="flex flex-col">
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        itemActive ? 'text-accent-700' : 'text-ink-700',
                      )}
                    >
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 text-xs leading-relaxed text-ink-400">{item.description}</span>
                    )}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

/**
 * Full-height slide-in navigation drawer for tablet and mobile.
 *
 * Groups from the desktop dropdowns become accordion sections here, seeded open
 * on whichever group contains the current page. The CTA and phone sit in a
 * pinned footer so they stay reachable however long the list grows.
 */
export function MobileMenu({
  isOpen,
  entries,
  cta,
  onClose,
  phone,
  phoneHref,
  currentPath = '/',
  currentQuery,
}: MobileMenuProps) {
  const query = currentQuery ?? new URLSearchParams()
  const firstFocusRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const allHrefs = collectNavigationHrefs(entries)

  const activeLabel =
    entries.find((entry) => 'items' in entry && isNavigationEntryActive(entry, allHrefs, currentPath, query))?.label ??
    null

  const [openLabel, setOpenLabel] = useState<string | null>(activeLabel)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    firstFocusRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose, activeLabel])

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
          'fixed inset-y-0 right-0 z-40 flex h-full w-full max-w-md flex-col bg-white shadow-lg',
          'transition-transform duration-300 ease-[var(--ease-out-soft)] lg:hidden',
          isOpen ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
      >
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-sand-200 px-6 lg:h-20">
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

        <nav className="flex-1 overflow-y-auto overscroll-contain px-6 py-4" aria-label="Mobile">
          <ul className="flex flex-col">
            {entries.map((entry, index) =>
              'items' in entry ? (
                <MobileAccordion
                  key={entry.label}
                  menu={entry}
                  isActive={isNavigationEntryActive(entry, allHrefs, currentPath, query)}
                  isOpen={openLabel === entry.label}
                  onToggle={() => setOpenLabel((current) => (current === entry.label ? null : entry.label))}
                  allHrefs={allHrefs}
                  currentPath={currentPath}
                  currentQuery={query}
                  onClose={onClose}
                  firstFocusRef={index === 0 ? firstFocusRef : undefined}
                />
              ) : (
                <MobileLinkRow
                  key={entry.href}
                  link={entry}
                  isActive={isNavigationLinkActive(entry.href, allHrefs, currentPath, query)}
                  onClose={onClose}
                  firstFocusRef={index === 0 ? firstFocusRef : undefined}
                />
              ),
            )}
          </ul>
        </nav>

        {/* Pinned actions — always reachable regardless of list length. */}
        <div className="shrink-0 border-t border-sand-200 px-6 py-5">
          <ButtonLink href={cta.href} variant="primary" size="lg" className="w-full" onClick={onClose}>
            {cta.label}
          </ButtonLink>

          <a
            href={`tel:${phoneHref}`}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-sand-200 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:border-accent-300 hover:text-accent-700"
          >
            <Icon name="phone" className="size-4" strokeWidth={2} />
            {phone}
          </a>
        </div>
      </div>
    </>
  )
}
