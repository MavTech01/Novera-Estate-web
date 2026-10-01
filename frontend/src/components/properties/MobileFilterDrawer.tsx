import { useEffect, useRef } from 'react'

import { useLockBodyScroll } from '@/shared/hooks/useLockBodyScroll'
import type { PropertyFiltersController } from '@/features/properties/hooks/usePropertyFilters'
import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'
import { PropertyFilters } from './PropertyFilters'

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  controller: PropertyFiltersController
  /** Result count shown on the primary action. */
  resultCount: number
}

/**
 * Full-height filter sheet for phones and small tablets.
 *
 * Filters apply live while the sheet is open — "Show N properties" is the
 * commit step that dismisses it. Focus moves into the sheet on open and back
 * to the trigger on close, and Escape always works.
 */
export function MobileFilterDrawer({ isOpen, onClose, controller, resultCount }: MobileFilterDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      // Keep focus inside the sheet: it is modal, so the page behind must not
      // be reachable with Tab.
      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-[60] bg-ink-900/50 transition-opacity duration-300 ease-[var(--ease-out-soft)] lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        ref={panelRef}
        id="property-filter-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Property filters"
        inert={!isOpen}
        data-open={isOpen}
        className={cn(
          'fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-white shadow-lg lg:hidden',
          'transition-transform duration-300 ease-[var(--ease-out-soft)]',
          isOpen ? 'visible translate-x-0' : 'invisible translate-x-full',
        )}
      >
        <PropertyFilters
          controller={controller}
          variant="drawer"
          idPrefix="drawer"
          onClose={onClose}
          closeButtonRef={closeButtonRef}
          className="h-full"
        />

        {/* Commit bar — pinned so the primary action is always reachable. */}
        <div className="shrink-0 border-t border-sand-200 bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-md bg-accent-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-[var(--ease-out-soft)] hover:bg-accent-700 hover:shadow-md active:bg-accent-800"
          >
            Show {resultCount.toLocaleString('en-NG')} {resultCount === 1 ? 'Property' : 'Properties'}
            <Icon name="arrow-right" className="size-4" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </>
  )
}
