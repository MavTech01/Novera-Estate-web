import { Link } from 'react-router-dom'
import { cn } from '@/shared/lib/cn'
import { Icon } from '@/shared/components/ui/Icon'
import type { PropertyCategory } from '@/types'
import type { CategoryGalleryMeta } from './categoryGalleryData'

interface CategoryGalleryCardProps {
  category: PropertyCategory
  meta: CategoryGalleryMeta
  className?: string
}

/**
 * Image-led architectural gallery card.
 * Streamlined on mobile (pure photography with clean title + micro-arrow),
 * while retaining badges, descriptions, and circular hover buttons on desktop.
 */
export function CategoryGalleryCard({
  category,
  meta,
  className,
}: CategoryGalleryCardProps) {
  return (
    <Link
      to={category.href}
      className={cn(
        'group relative flex w-full flex-col justify-end overflow-hidden rounded-2xl bg-tint-100 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:shadow-lg sm:rounded-3xl',
        meta.minHeightClasses,
        className,
      )}
    >
      {/* Full-bleed background image with smooth hover zoom */}
      <img
        src={category.image.src}
        alt={category.image.alt}
        width={1200}
        height={800}
        loading="lazy"
        decoding="async"
        className="media absolute inset-0 size-full object-cover"
      />

      {/* Smooth transparent gradient from bottom up */}
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/35"
        aria-hidden="true"
      />

      {/* Top Floating Badge (hidden on mobile to keep photography 100% clean and uncluttered) */}
      <div className="absolute inset-x-0 top-0 z-10 hidden items-center justify-between p-3 sm:flex sm:p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <span>{meta.tag}</span>
        </span>

        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-2.5 py-1 text-[0.6875rem] font-medium text-white backdrop-blur-sm">
          <Icon name="arrow-up-right" className="size-3 text-accent-400" />
          <span>Explore</span>
        </span>
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 flex items-end justify-between gap-3 p-3 sm:p-4 lg:p-5">
        <div className="flex min-w-0 flex-col gap-0.5 sm:gap-1">
          <h3 className="inline-flex items-center gap-1.5 font-display text-sm font-extrabold tracking-tight text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-xl lg:text-2xl truncate">
            <span>{category.name}</span>
            {/* Inline micro arrow on mobile */}
            <Icon
              name="arrow-right"
              className="size-3.5 shrink-0 text-white/90 sm:hidden transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </h3>

          {/* Subtitle hidden on mobile to give maximum breathing room to the photography */}
          <p className="hidden max-w-md text-xs leading-relaxed text-white/80 line-clamp-1 sm:block lg:text-sm">
            {meta.subtitle || category.description}
          </p>
        </div>

        {/* Circular Explorer Button (Tablet & Desktop only) */}
        <span className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-accent-400 group-hover:bg-accent-600 group-hover:text-white sm:flex lg:size-10">
          <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2} />
        </span>
      </div>

      <span className="sr-only">Browse {category.name}</span>
    </Link>
  )
}
