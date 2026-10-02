import { useCallback, useEffect, useRef } from 'react'

import { Icon } from '@/shared/components/ui/Icon'
import { ImageLightbox } from '@/shared/components/ui/ImageLightbox'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import { useDisclosure } from '@/shared/hooks/useDisclosure'
import { useGallery } from '@/shared/hooks/useGallery'
import { cn } from '@/shared/lib/cn'
import type { ImageAsset } from '@/types'
import { buildProjectGallery } from '@/features/projects/utils/projectGallery'
import type { Project } from '@/features/projects/types/projectTypes'

interface ProjectGalleryProps {
  project: Project
  /** Overrides the assembled gallery — used by tests and by the API payload. */
  images?: ImageAsset[]
  className?: string
}

/**
 * Project image gallery.
 *
 * Takes any `ImageAsset[]`, so it is reusable by the properties feature too. The
 * active index lives here rather than in the lightbox, which is what keeps the
 * thumbnails, the dots, the counter and the fullscreen view pointing at the same
 * photo — and means closing the lightbox leaves the visitor where they were.
 *
 * The two breakpoints are deliberately different controls, not one control
 * re-laid-out:
 *
 *  - **Desktop** pairs one large 16:9 image with a column of thumbnails. The
 *    thumbnail rail lists every image *except* the one on screen, so the main
 *    image is never repeated as its own thumbnail — which is what left a stray
 *    "1 / 3" and a duplicate photo in the old strip.
 *  - **Mobile** drops the thumbnails entirely and makes the image itself a
 *    scroll-snap carousel with dots. Thumbnails three across on a phone are too
 *    small to choose from, and a separate large image above a rail of the same
 *    photographs is two carousels competing for one glance.
 *
 * Swipe needs no library: `snap-x snap-mandatory` gives the snap, and the rail's
 * own `scrollLeft` is the source of truth for which photo is showing, so a swipe,
 * a dot, an arrow and the lightbox can never disagree.
 */
export function ProjectGallery({ project, images, className }: ProjectGalleryProps) {
  const gallery = images ?? buildProjectGallery(project)
  const total = gallery.length
  const { index, goTo, next, previous } = useGallery(total)
  const { isOpen, open, close } = useDisclosure()

  const railRef = useRef<HTMLUListElement | null>(null)

  const active = gallery[index]
  const hasMultiple = total > 1

  /** Everything except the photo currently on screen. */
  const supporting = gallery.filter((_, position) => position !== index)

  /**
   * Keeps the carousel aligned when the index changes from a source that is not
   * the rail itself — a dot, the lightbox, or back/forward on a URL that carries
   * an image index.
   *
   * `nearest` is what makes a swipe feel like a swipe: a partially scrolled rail
   * snaps the last one to its resting position instead of being yanked.
   */
  const scrollRailTo = useCallback((position: number) => {
    const rail = railRef.current
    const slide = rail?.children[position] as HTMLElement | undefined
    if (!rail || !slide) return

    rail.scrollTo({ left: slide.offsetLeft - rail.offsetLeft, behavior: 'smooth' })
  }, [])

  // Dot and lightbox changes move the rail.
  useEffect(() => {
    if (!isOpen) scrollRailTo(index)
  }, [index, isOpen, scrollRailTo])

  // A swipe moves the index.
  useEffect(() => {
    const rail = railRef.current
    if (!rail || total < 2) return

    let frame = 0

    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        // The settled slide is whichever centre is closest to the rail's centre.
        const centre = rail.scrollLeft + rail.clientWidth / 2
        let closest = 0
        let closestDistance = Infinity

        for (let position = 0; position < rail.children.length; position += 1) {
          const slide = rail.children[position] as HTMLElement
          const slideCentre = slide.offsetLeft - rail.offsetLeft + slide.clientWidth / 2
          const distance = Math.abs(slideCentre - centre)
          if (distance < closestDistance) {
            closestDistance = distance
            closest = position
          }
        }

        goTo(closest)
      })
    }

    rail.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      rail.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [goTo, total])

  if (!active) return null

  return (
    <div className={className}>
      {/*
        Mobile: one carousel. Full-bleed to the gutter rather than to the screen
        edge, so it lines up with every other block on the page.
      */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden rounded-2xl bg-tint-100 shadow-sm">
          <ul
            ref={railRef}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
            aria-label={`${project.name} gallery`}
          >
            {gallery.map((image, position) => (
              <li key={image.src} className="w-full shrink-0 snap-center">
                <SkeletonImage
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={900}
                  loading={position === 0 ? 'eager' : 'lazy'}
                  className="aspect-[4/3] w-full"
                  imgClassName="media"
                />
              </li>
            ))}
          </ul>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-900/45 to-transparent"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            {/* One counter for the whole carousel, not one per slide. */}
            <span className="rounded-pill bg-ink-900/70 px-3 py-1.5 text-xs font-semibold tabular-nums text-white backdrop-blur-sm">
              {index + 1} / {total}
            </span>

            <button
              type="button"
              onClick={open}
              className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-white/90 px-3.5 py-2 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white"
            >
              <Icon name="expand" className="size-4" strokeWidth={2} />
              View
            </button>
          </div>

          {hasMultiple && (
            <ul className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
              {gallery.map((image, position) => (
                <li key={image.src}>
                  <button
                    type="button"
                    onClick={() => goTo(position)}
                    aria-label={`Show image ${position + 1} of ${total}`}
                    aria-current={position === index ? 'true' : undefined}
                    className={cn(
                      'block h-1.5 rounded-pill transition-all duration-300',
                      position === index ? 'w-5 bg-white' : 'w-1.5 bg-white/55',
                    )}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Desktop: one large image with a thumbnail column beside it. */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_9.5rem]">
        <div className="group relative overflow-hidden rounded-2xl bg-tint-100 shadow-md">
          <SkeletonImage
            key={active.src}
            src={active.src}
            alt={active.alt}
            width={1600}
            height={900}
            className="aspect-[16/9] w-full"
            imgClassName="media"
          />

          {/* Gradient keeps the counter and controls legible over light skies. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-900/45 to-transparent"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <span className="rounded-pill bg-ink-900/70 px-3 py-1.5 text-xs font-semibold tabular-nums text-white backdrop-blur-sm">
              {index + 1} / {total}
            </span>

            <button
              type="button"
              onClick={open}
              className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-white/90 px-3.5 py-2 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white"
            >
              <Icon name="expand" className="size-4" strokeWidth={2} />
              View gallery
            </button>
          </div>

          {hasMultiple && (
            <>
              <GalleryArrow side="left" onClick={previous} label="Previous image" />

              <button
                type="button"
                onClick={open}
                aria-label={`Open gallery, image ${index + 1} of ${total}`}
                className="absolute inset-0 z-[1] cursor-zoom-in"
              />

              <GalleryArrow side="right" onClick={next} label="Next image" />
            </>
          )}
        </div>

        {/*
          Supporting shots. The image on screen is filtered out above, so there
          is never a second copy of it in the rail.
        */}
        {hasMultiple && (
          <ul className="grid grid-rows-3 gap-3" aria-label={`${project.name} gallery images`}>
            {supporting.map((image) => {
              const position = gallery.indexOf(image)

              return (
                <li key={image.src}>
                  <button
                    type="button"
                    onClick={() => goTo(position)}
                    aria-label={`Show image ${position + 1} of ${total}`}
                    className="group/thumb block w-full overflow-hidden rounded-xl border-2 border-transparent bg-tint-100 transition-colors duration-200 hover:border-accent-300 focus-visible:border-accent-400"
                  >
                    <SkeletonImage
                      src={image.src}
                      alt=""
                      width={400}
                      height={300}
                      loading="lazy"
                      className="aspect-[4/3] w-full"
                    />
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <ImageLightbox
        isOpen={isOpen}
        images={gallery}
        index={index}
        onIndexChange={goTo}
        onClose={close}
        title={project.name}
      />
    </div>
  )
}

interface GalleryArrowProps {
  side: 'left' | 'right'
  onClick: () => void
  label: string
}

/** Circular overlay control. Desktop only — on touch the rail is swipeable. */
function GalleryArrow({ side, onClick, label }: GalleryArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-pill',
        'bg-white/90 text-ink-900 shadow-sm backdrop-blur-sm transition-all duration-200',
        'hover:bg-white',
        side === 'left' ? 'left-4' : 'right-4',
      )}
    >
      <Icon name={side === 'left' ? 'chevron-left' : 'chevron-right'} className="size-5" strokeWidth={2.2} />
    </button>
  )
}
