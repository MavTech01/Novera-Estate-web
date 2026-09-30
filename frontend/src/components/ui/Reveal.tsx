import { useInView } from '../../hooks/useInView'
import { cn } from '../../lib/cn'

interface RevealProps {
  /** Element to render. Defaults to a block-level wrapper. */
  as?: React.ElementType
  /** Stagger delay in milliseconds. */
  delay?: number
  className?: string
  children: React.ReactNode
  threshold?: number
}

/**
 * Fades content up the first time it scrolls into view.
 * Animation is CSS-only and fully disabled under `prefers-reduced-motion`.
 */
export function Reveal({ as: Element = 'div', delay = 0, className, children, threshold }: RevealProps) {
  const { ref, isInView } = useInView<HTMLElement>({ threshold })

  const Tag = Element as React.ElementType

  return (
    <Tag
      ref={ref}
      className={cn('reveal', isInView && 'is-visible', className)}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  )
}
