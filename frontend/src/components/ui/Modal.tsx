import { useEffect, useRef } from 'react'

import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { cn } from '../../lib/cn'
import { Icon } from './Icon'

/** Selector for everything that can hold focus inside a dialog. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  /** Rendered as the dialog's accessible name; also used for the heading level. */
  title: string
  description?: string
  children: React.ReactNode
  /** `dark` is used by the image lightbox, `light` by the inspection dialog. */
  tone?: 'light' | 'dark'
  /** Constrains the panel width; the lightbox passes a wider value. */
  size?: 'md' | 'lg' | 'full'
  /** Extra controls rendered beside the close button (lightbox counter). */
  headerSlot?: React.ReactNode
  className?: string
}

const tones = {
  light: {
    backdrop: 'bg-ink-900/55',
    panel: 'bg-white shadow-lg',
    text: 'text-ink-900',
    muted: 'text-ink-500',
    close: 'border-sand-200 text-ink-600 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700',
  },
  dark: {
    backdrop: 'bg-ink-900/90',
    panel: 'bg-ink-900 shadow-lg',
    text: 'text-white',
    muted: 'text-white/60',
    close: 'border-white/20 text-white/80 hover:border-white/40 hover:bg-white/10 hover:text-white',
  },
} as const

const sizes = {
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  full: 'max-w-[min(72rem,100%)]',
} as const

/**
 * Accessible dialog shell: focus is trapped while open, Escape and the
 * backdrop both close it, the page behind is scroll-locked, and focus returns
 * to whatever opened it. Rendered by the lightbox and the inspection form so
 * neither has to reimplement dialog behaviour.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  tone = 'light',
  size = 'md',
  headerSlot,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const styles = tones[tone]

  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault()
        last.focus()
        return
      }

      if (!event.shiftKey && active === last) {
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
    <div
      // Kept mounted so the exit transition can play, but removed from the
      // accessibility tree and the tab order while closed.
      inert={!isOpen}
      aria-hidden={!isOpen}
      className={cn(
        'fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6',
        'transition-opacity duration-300 ease-[var(--ease-out-soft)]',
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <div
        onClick={onClose}
        aria-hidden
        className={cn('absolute inset-0 transition-colors duration-300', styles.backdrop)}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl',
          sizes[size],
          styles.panel,
          'transform-gpu transition-transform duration-300 ease-[var(--ease-out-soft)]',
          isOpen ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-6 opacity-0 sm:scale-[0.98]',
          className,
        )}
      >
        <header
          className={cn(
            'flex shrink-0 items-start justify-between gap-4 border-b px-6 py-5',
            tone === 'dark' ? 'border-white/10' : 'border-sand-200',
          )}
        >
          <div className="min-w-0">
            <h2 className={cn('font-display text-lg leading-snug', styles.text)}>{title}</h2>
            {description && <p className={cn('mt-1 text-sm', styles.muted)}>{description}</p>}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {headerSlot}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                'inline-flex size-11 items-center justify-center rounded-md border transition-colors duration-200',
                styles.close,
              )}
            >
              <Icon name="close" className="size-5" strokeWidth={2} />
            </button>
          </div>
        </header>

        {/*
          Mobile sheets open from the bottom edge, so the body scrolls with the
          page rather than trapping the thumb on a nested scroll area.
        */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
