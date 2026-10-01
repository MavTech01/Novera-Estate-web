import { cn } from '@/shared/lib/cn'

interface ContainerProps {
  as?: 'div' | 'section' | 'header' | 'footer'
  /**
   * `page` is the 1200px content rail every section uses; `nav` is the slightly
   * wider 1280px rail reserved for the navigation bar. Both share the same
   * gutter, so the page edge stays on one grid.
   */
  width?: 'page' | 'nav'
  className?: string
  children: React.ReactNode
}

const widths: Record<NonNullable<ContainerProps['width']>, string> = {
  page: 'max-w-[var(--container-page)]',
  nav: 'max-w-[var(--container-nav)]',
}

/** Shared max-width + horizontal gutter for every section and the navbar. */
export function Container({ as: Element = 'div', width = 'page', className, children }: ContainerProps) {
  return (
    <Element className={cn('mx-auto w-full px-6 sm:px-8', widths[width], className)}>{children}</Element>
  )
}
