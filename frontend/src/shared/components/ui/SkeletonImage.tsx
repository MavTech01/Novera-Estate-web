import { useState } from 'react'

import { cn } from '@/shared/lib/cn'

interface SkeletonImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  imgClassName?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Image with a soft placeholder that stays visible until the file decodes.
 * Keeps lazy-loaded listing grids from flashing empty boxes.
 */
export function SkeletonImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  loading = 'lazy',
  fetchPriority,
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <span className={cn('relative block overflow-hidden bg-tint-100', className)}>
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-tint-50 via-tint-100 to-tint-50 animate-pulse-soft transition-opacity duration-500',
          isLoaded ? 'opacity-0' : 'opacity-100',
        )}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={cn(
          'relative size-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </span>
  )
}
