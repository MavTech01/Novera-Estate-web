import { useCallback, useEffect } from 'react'

import type { ImageAsset } from '@/types'
import { Modal } from './Modal'

interface ImageLightboxProps {
  isOpen: boolean
  images: ImageAsset[]
  /** Active image. Owned by the page so the lightbox and the strip stay in step. */
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Used for the accessible name, e.g. "Novera Heights — photos". */
  title: string
}

/**
 * Fullscreen image viewer, shared by every gallery on the site.
 *
 * Sits on top of the shared `Modal`, which handles Escape, the focus trap and
 * scroll locking. The active index is owned by the gallery rather than kept
 * locally here, so arrow keys, the on-screen controls and the thumbnail strip
 * all move together, and closing the lightbox leaves the page on the image the
 * visitor was last looking at. Navigation wraps at both ends.
 *
 * The component is deliberately unopinionated about *what* is being browsed —
 * pair it with `useGallery` and any `ImageAsset[]` becomes a full gallery.
 */
export function ImageLightbox({
  isOpen,
  images,
  index,
  onIndexChange,
  onClose,
  title,
}: ImageLightboxProps) {
  const total = images.length
  const activeImage = images[index]

  const showPrevious = useCallback(
    () => onIndexChange((index - 1 + total) % total),
    [index, onIndexChange, total],
  )
  const showNext = useCallback(() => onIndexChange((index + 1) % total), [index, onIndexChange, total])

  // Arrow-key navigation is bound only while the lightbox is open, so it cannot
  // hijack scrolling of the page behind the dialog.
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPrevious()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNext()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, showNext, showPrevious])

  if (!activeImage) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      tone="dark"
      size="full"
      title={`${title} — photos`}
      headerSlot={
        <span className="rounded-pill bg-white/10 px-3 py-1.5 text-xs font-semibold tabular-nums text-white/80">
          {index + 1} / {total}
        </span>
      }
      className="h-[92dvh]"
    >
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <img
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          width={1600}
          height={1000}
          className="max-h-full min-h-0 w-auto max-w-full animate-fade-in rounded-lg object-contain"
        />

        <div className="flex items-center gap-4">
          <LightboxButton onClick={showPrevious} label="Previous image" disabled={total < 2}>
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </LightboxButton>

          <p className="min-w-24 text-center text-sm font-medium tabular-nums text-white/70">
            {index + 1} of {total}
          </p>

          <LightboxButton onClick={showNext} label="Next image" disabled={total < 2}>
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </LightboxButton>
        </div>

        <p className="text-center text-xs text-white/40">Use the arrow keys to browse, Esc to close</p>
      </div>
    </Modal>
  )
}

interface LightboxButtonProps {
  onClick: () => void
  label: string
  disabled?: boolean
  children: React.ReactNode
}

/** Round overlay control used for the lightbox arrows. */
function LightboxButton({ onClick, label, disabled = false, children }: LightboxButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex size-12 items-center justify-center rounded-pill border border-white/20 text-white transition-colors duration-200 hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}