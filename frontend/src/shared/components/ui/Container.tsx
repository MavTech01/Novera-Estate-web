import { cn } from '@/shared/lib/cn'

export type ContainerWidth = 'page' | 'nav' | 'narrow' | 'medium' | 'large' | 'wide' | 'full'

interface ContainerProps {
  as?: 'div' | 'section' | 'header' | 'footer'
  /**
   * Container width presets.
   * - `page`: active site-wide content rail (customizable in theme.css)
   * - `nav`: navigation bar rail
   * - `narrow`: 1024px
   * - `medium`: 1280px
   * - `large`: 1440px
   * - `wide`: 1600px
   * - `full`: 100%
   */
  width?: ContainerWidth
  className?: string
  children: React.ReactNode
}

const widths: Record<ContainerWidth, string> = {
  page: 'max-w-[var(--container-page)]',
  nav: 'max-w-[var(--container-nav)]',
  narrow: 'max-w-[var(--container-narrow)]',
  medium: 'max-w-[var(--container-medium)]',
  large: 'max-w-[var(--container-large)]',
  wide: 'max-w-[var(--container-wide)]',
  full: 'max-w-full',
}

/** Shared max-width + horizontal gutter for every section and the navbar. */
export function Container({ as: Element = 'div', width = 'page', className, children }: ContainerProps) {
  return (
    <Element className={cn('mx-auto w-full px-6 sm:px-8', widths[width], className)}>{children}</Element>
  )
}
