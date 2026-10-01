import { cn } from '@/shared/lib/cn'

interface SkeletonProps {
  className?: string
  /** Hidden from assistive tech — placeholders carry no information. */
  label?: string
}

/**
 * Shimmering placeholder block.
 * Mirrors the shape of the real content it stands in for, so layout does not
 * shift when data arrives.
 */
export function Skeleton({ className, label }: SkeletonProps) {
  return (
    <span
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn('skeleton block', className)}
    />
  )
}
