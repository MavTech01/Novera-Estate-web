import { useCallback, useRef } from 'react'

import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { useGallery } from '@/shared/hooks/useGallery'
import { cn } from '@/shared/lib/cn'
import type { ImageAsset } from '@/types'
import { Button } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { ImageLightbox } from '@/shared/components/ui/ImageLightbox'

interface PropertyGalleryProps {
  images: ImageAsset[]
  propertyTitle: string
  className?: string
}

/**
 * Primary media for a property.
 *
 * A single CSS scroll-snap track backs every breakpoint: swiping works on
 * touch, the arrows and thumbnails drive the same track from pointer and
 * keyboard, and opening the lightbox keeps the active index, so there is only
 * one source of truth for "which photo is showing".
 */
export function PropertyGallery({ images, propertyTitle, className }: PropertyGalleryProps) {
  const { index, goTo, total } = useGallery(images.length)
  const lightbox = useDisclosure()
  const trackRef = useRef<HTMLDivElement>(null)
  const thumbnailsRef = useRef<HTMLDivElement>(null)

  /** Scrolls the track to the requested slide. */
  const scrollToIndex = useCallback((nextIndex: number) => {
    const track = trackRef.current
    if (!track) return

    track.children[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }, [])

  /**
   * The track is the source of truth while swiping, so the selected index is
   * read back from the scroll position instead of from a click handler.
   */
  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const nextIndex = Math.round(track.scrollLeft / track.clientWidth)
    if (nextIndex !== index) goTo(nextIndex)
  }, [goTo, index])

  const selectImage = useCallback(
    (nextIndex: number) => {
      goTo(nextIndex)
      scrollToIndex(nextIndex)
      thumbnailsRef.current?.children[nextIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    },
    [goTo, scrollToIndex],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        selectImage(index - 1)
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        selectImage(index + 1)
      }
    },
    [index, selectImage],
  )

  if (total === 0) return null

  const isFirst = index === 0
  const isLast = index === total - 1

  return (
    <section className={cn('min-w-0', className)} aria-label="Property photos">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${propertyTitle} — ${total} photos`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative"
      >
        {/* Swipe track. Fixed aspect ratio keeps the page height stable. */}
        <div
          id="property-gallery-track"
          ref={trackRef}
          onScroll={handleScroll}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-2xl bg-tint-100"
        >
          {images.map((image, imageIndex) => (
            <div
              key={image.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`Image ${imageIndex + 1} of ${total}`}
              className="relative aspect-[4/3] w-full shrink-0 snap-center sm:aspect-[16/10]"
            >
              <SkeletonImage
                src={image.src}
                alt={image.alt}
                width={1600}
                height={1000}
                loading={imageIndex === 0 ? 'eager' : 'lazy'}
                fetchPriority={imageIndex === 0 ? 'high' : 'auto'}
                className="absolute inset-0 size-full"
                imgClassName="media"
              />
            </div>
          ))}
        </div>

        {/*
          Desktop only: the whole image surface opens the lightbox. Hidden on
          touch, where the same area must stay available for swiping.
        */}
        {total > 1 && (
          <button
            type="button"
            onClick={() => lightbox.open()}
            aria-label={`Open photo ${index + 1} of ${total} fullscreen`}
            className="absolute inset-0 hidden cursor-zoom-in bg-transparent transition-colors duration-200 hover:bg-ink-900/5 sm:block"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          {total > 1 && (
            <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-pill bg-ink-900/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Icon name="expand" className="size-3.5" strokeWidth={2} />
              {index + 1} of {total}
            </span>
          )}

          {total > 1 && (
            <button
              type="button"
              onClick={() => lightbox.open()}
              aria-label="View all photos fullscreen"
              className="pointer-events-auto ml-auto inline-flex size-11 items-center justify-center rounded-pill bg-white/90 text-ink-700 backdrop-blur-sm transition-colors duration-200 hover:bg-white hover:text-accent-600"
            >
              <Icon name="expand" className="size-[1.15rem]" strokeWidth={2} />
            </button>
          )}
        </div>

        {total > 1 && (
          <>
            <GalleryArrow
              onClick={() => selectImage(index - 1)}
              label="Previous photo"
              disabled={isFirst}
              className="left-4"
              direction="left"
            />
            <GalleryArrow
              onClick={() => selectImage(index + 1)}
              label="Next photo"
              disabled={isLast}
              className="right-4"
              direction="right"
            />
          </>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div
          ref={thumbnailsRef}
          className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Choose a photo"
        >
          {images.map((image, imageIndex) => {
            const isActive = imageIndex === index

            return (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show photo ${imageIndex + 1}`}
                onClick={() => selectImage(imageIndex)}
                className={cn(
                  'relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ease-[var(--ease-out-soft)] sm:w-24',
                  isActive
                    ? 'border-accent-500 opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <img
                  src={image.src}
                  alt=""
                  aria-hidden
                  width={200}
                  height={150}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-500">
          <span className="font-semibold text-ink-900">{total}</span> {total === 1 ? 'photo' : 'photos'} of this property
        </p>

        {total > 1 && (
          <Button type="button" variant="outline" size="sm" onClick={() => lightbox.open()}>
            <Icon name="expand" className="size-4" strokeWidth={2} />
            View All Photos
          </Button>
        )}
      </div>

      <ImageLightbox
        isOpen={lightbox.isOpen}
        images={images}
        index={index}
        onIndexChange={selectImage}
        onClose={lightbox.close}
        title={propertyTitle}
      />
    </section>
  )
}

interface GalleryArrowProps {
  onClick: () => void
  label: string
  disabled: boolean
  className?: string
  direction: 'left' | 'right'
}

/** Circular previous/next control floating over the media. */
function GalleryArrow({ onClick, label, disabled, className, direction }: GalleryArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-controls="property-gallery-track"
      className={cn(
        'absolute top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-pill',
        'bg-white/90 text-ink-700 shadow-sm backdrop-blur-sm transition-all duration-200 ease-[var(--ease-out-soft)]',
        'hover:bg-white hover:text-accent-600 disabled:cursor-not-allowed disabled:opacity-0 sm:inline-flex',
        className,
      )}
    >
      <Icon
        name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
        className="size-5"
        strokeWidth={2.2}
      />
    </button>
  )
}
