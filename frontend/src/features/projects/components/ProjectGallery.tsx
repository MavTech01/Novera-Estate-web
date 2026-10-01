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
 * Project image gallery: one large primary image with a thumbnail rail.
 *
 * Takes any `ImageAsset[]`, so it is reusable by the properties feature too. The
 * active index lives here rather than in the lightbox, which is what keeps the
 * thumbnails, the counter and the fullscreen view pointing at the same photo —
 * and means closing the lightbox leaves the visitor where they were.
 *
 * Mobile uses a scroll-snap rail rather than a thumbnail strip: the strip would
 * need three or four across a phone, which defeats the purpose of it.
 */
export function ProjectGallery({ project, images, className }: ProjectGalleryProps) {
  const gallery = images ?? buildProjectGallery(project)
  const total = gallery.length
  const { index, goTo, next, previous } = useGallery(total)
  const { isOpen, open, close } = useDisclosure()

  const active = gallery[index]
  const hasMultiple = total > 1

  if (!active) return null

  return (
    <div className={className}>
      {/* Primary image */}
      <div className="group relative overflow-hidden rounded-2xl bg-tint-100 shadow-md">
        <SkeletonImage
          key={active.src}
          src={active.src}
          alt={active.alt}
          width={1600}
          height={1000}
          className="aspect-[16/10] w-full sm:aspect-[16/9]"
          imgClassName="media"
        />

        {/* Gradient keeps the counter and controls legible over light skies. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-900/45 to-transparent"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
          <span className="rounded-pill bg-ink-900/70 px-3 py-1.5 text-xs font-semibold tabular-nums text-white backdrop-blur-sm">
            {index + 1} / {total}
          </span>

          <button
            type="button"
            onClick={open}
            className="inline-flex min-h-10 items-center gap-2 rounded-pill bg-white/90 px-3.5 py-2 text-xs font-semibold text-ink-900 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:bg-white"
          >
            <Icon name="expand" className="size-4" strokeWidth={2} />
            <span className="hidden sm:inline">View gallery</span>
            <span className="sm:hidden">View</span>
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

      {/* Thumbnails — desktop and tablet. */}
      {hasMultiple && (
        <ul
          className="mt-3 hidden grid-cols-4 gap-3 sm:grid lg:grid-cols-6"
          aria-label={`${project.name} gallery thumbnails`}
        >
          {gallery.map((image, position) => {
            const isActive = position === index

            return (
              <li key={image.src}>
                <button
                  type="button"
                  onClick={() => goTo(position)}
                  aria-label={`Show image ${position + 1} of ${total}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative block w-full overflow-hidden rounded-lg border-2 transition-all duration-200',
                    isActive
                      ? 'border-accent-600 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100 focus-visible:border-accent-400',
                  )}
                >
                  <SkeletonImage
                    src={image.src}
                    alt=""
                    width={400}
                    height={250}
                    loading="lazy"
                    className="aspect-[16/10] w-full"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* Swipe rail — mobile. Scroll-snap gives the swipe without a library. */}
      {hasMultiple && (
        <ul
          className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 sm:hidden"
          style={{ scrollbarWidth: 'none' }}
          aria-label={`${project.name} gallery images`}
        >
          {gallery.map((image, position) => (
            <li key={image.src} className="w-4/5 shrink-0 snap-center">
              <SkeletonImage
                src={image.src}
                alt={image.alt}
                width={800}
                height={500}
                loading="lazy"
                className="aspect-[16/10] w-full rounded-lg"
              />
              <span className="mt-1.5 block text-center text-[0.6875rem] font-semibold tabular-nums text-ink-400">
                {position + 1} / {total}
              </span>
            </li>
          ))}
        </ul>
      )}

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

/** Circular overlay control; hidden from touch users, where swiping is natural. */
function GalleryArrow({ side, onClick, label }: GalleryArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'absolute top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-pill',
        'bg-white/90 text-ink-900 shadow-sm backdrop-blur-sm transition-all duration-200',
        'hover:bg-white md:inline-flex',
        side === 'left' ? 'left-4' : 'right-4',
      )}
    >
      <Icon name={side === 'left' ? 'chevron-left' : 'chevron-right'} className="size-5" strokeWidth={2.2} />
    </button>
  )
}
