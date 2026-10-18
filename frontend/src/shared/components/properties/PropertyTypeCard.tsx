import { Link } from 'react-router-dom'

import { cn } from '@/shared/lib/cn'
import type { PropertyCategory } from '@/types'
import { Icon } from '@/shared/components/ui/Icon'

interface PropertyTypeCardProps {
  category: PropertyCategory
  className?: string
}

/** Image-led category card: image, label, description and a hover arrow. */
export function PropertyTypeCard({ category, className }: PropertyTypeCardProps) {
  return (
    <Link
      to={category.href}
      className={cn(
        'group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl bg-tint-100',
        'shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-md',
        'focus-visible:-translate-y-1 focus-visible:shadow-md',
        className,
      )}
    >
      <img
        src={category.image.src}
        alt={category.image.alt}
        width={900}
        height={700}
        loading="lazy"
        decoding="async"
        className="media absolute inset-0 size-full object-cover"
      />

      <span
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5 transition-opacity duration-300 group-hover:from-black/85 group-hover:via-black/45"
        aria-hidden
      />

      <span className="relative flex items-end justify-between gap-4 p-5">
        <span className="flex flex-col gap-1.5">
          <span className="font-display text-xl font-semibold text-white">{category.name}</span>
          <span className="max-w-[16rem] text-sm leading-relaxed text-white/80">{category.description}</span>
        </span>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover:border-accent-300/60 group-hover:bg-accent-500 group-hover:text-white">
          <Icon name="arrow-right" className="arrow-nudge size-4" strokeWidth={2} />
        </span>
      </span>

      <span className="sr-only">Browse {category.name}</span>
    </Link>
  )
}
