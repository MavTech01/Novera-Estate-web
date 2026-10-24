import { useCallback, useEffect, useRef, useState } from 'react'

import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { useOutsideClick } from '@/shared/hooks/useOutsideClick'
import { buildShareLinks } from '@/shared/lib/contactLinks'
import { cn } from '@/shared/lib/cn'
import type { Property } from '@/types'
import { BrandIcon } from '@/shared/components/ui/BrandIcon'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyShareButtonsProps {
  property: Property
  className?: string
}

/**
 * Share control for a listing.
 *
 * A single trigger opens the options — copy link, WhatsApp, Facebook and X —
 * rather than four permanent buttons on the page. External targets open in a
 * new tab; "copy" gives immediate written feedback.
 *
 * The popover menu dynamically detects available viewport space so it never
 * bleeds off-screen on mobile or tablet, aligning to whichever side has enough room.
 */
export function PropertyShareButtons({ property, className }: PropertyShareButtonsProps) {
  const { isOpen, close, toggle } = useDisclosure()
  const containerRef = useRef<HTMLDivElement>(null)
  const { copied, copy } = useCopyToClipboard()

  const [placement, setPlacement] = useState<{
    horizontal: 'left' | 'right'
    vertical: 'bottom' | 'top'
  }>({
    horizontal: 'left',
    vertical: 'bottom',
  })

  const updatePlacement = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const POPOVER_WIDTH = 224 // w-56 = 14rem = 224px
    const POPOVER_HEIGHT = 185
    const BUFFER = 16

    // Space available from trigger left to right edge of screen
    const spaceToRight = viewportWidth - rect.left
    // Space available from trigger right to left edge of screen
    const spaceToLeft = rect.right

    let horizontal: 'left' | 'right' = 'left'
    if (spaceToRight >= POPOVER_WIDTH + BUFFER) {
      horizontal = 'left'
    } else if (spaceToLeft >= POPOVER_WIDTH + BUFFER) {
      horizontal = 'right'
    } else {
      horizontal = spaceToRight >= spaceToLeft ? 'left' : 'right'
    }

    // Vertical placement
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    let vertical: 'bottom' | 'top' = 'bottom'
    if (spaceBelow < POPOVER_HEIGHT + BUFFER && spaceAbove >= POPOVER_HEIGHT + BUFFER) {
      vertical = 'top'
    }

    setPlacement({ horizontal, vertical })
  }, [])

  useOutsideClick(containerRef, close, isOpen)

  useEffect(() => {
    if (!isOpen) return
    updatePlacement()
    window.addEventListener('resize', updatePlacement)
    window.addEventListener('scroll', updatePlacement, { passive: true })
    return () => {
      window.removeEventListener('resize', updatePlacement)
      window.removeEventListener('scroll', updatePlacement)
    }
  }, [isOpen, updatePlacement])

  const handleToggle = useCallback(() => {
    updatePlacement()
    toggle()
  }, [updatePlacement, toggle])

  const handleCopy = useCallback(() => {
    void copy(window.location.href)
  }, [copy])

  const shareLinks = buildShareLinks(
    window.location.href,
    property.title,
    `${property.title} — ${property.location.label}`,
  )

  const originClass =
    placement.vertical === 'bottom'
      ? placement.horizontal === 'left'
        ? 'origin-top-left'
        : 'origin-top-right'
      : placement.horizontal === 'left'
        ? 'origin-bottom-left'
        : 'origin-bottom-right'

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={cn(
          'inline-flex h-11 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors duration-200',
          isOpen
            ? 'border-accent-300 bg-tint-50 text-accent-700'
            : 'border-sand-200 text-ink-600 hover:border-accent-300 hover:text-accent-700',
        )}
      >
        <Icon name="share" className="size-4" strokeWidth={2} />
        Share
      </button>

      <div
        role="menu"
        aria-label={`Share ${property.title}`}
        className={cn(
          'absolute z-30 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-sand-200 bg-white p-1.5 shadow-lg',
          'transition-all duration-200 ease-[var(--ease-out-soft)]',
          placement.horizontal === 'left' ? 'left-0' : 'right-0',
          placement.vertical === 'bottom' ? 'top-[calc(100%+0.5rem)]' : 'bottom-[calc(100%+0.5rem)]',
          originClass,
          isOpen ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0',
        )}
      >
        <button
          type="button"
          role="menuitem"
          onClick={handleCopy}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-ink-600 transition-colors duration-200 hover:bg-tint-50 hover:text-accent-700"
        >
          <Icon name={copied ? 'check' : 'copy'} className="size-4 shrink-0 text-accent-600" strokeWidth={2} />
          {copied ? 'Link copied' : 'Copy link'}
        </button>

        <ShareLink href={shareLinks.whatsapp} label="Share on WhatsApp" icon="whatsapp" />
        <ShareLink href={shareLinks.facebook} label="Share on Facebook" icon="facebook" />
        <ShareLink href={shareLinks.x} label="Share on X" icon="x" />
      </div>
    </div>
  )
}

interface ShareLinkProps {
  href: string
  label: string
  icon: 'whatsapp' | 'facebook' | 'x'
}

/** One outbound share target inside the popover menu. */
function ShareLink({ href, label, icon }: ShareLinkProps) {
  return (
    <a
      href={href}
      role="menuitem"
      target="_blank"
      rel="noreferrer noopener"
      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium text-ink-600 transition-colors duration-200 hover:bg-tint-50 hover:text-accent-700"
    >
      <BrandIcon name={icon} className="size-4 shrink-0 text-ink-500" />
      {label}
    </a>
  )
}
