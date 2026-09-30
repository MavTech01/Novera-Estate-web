import { cn } from '../../lib/cn'

interface ContainerProps {
  as?: 'div' | 'section' | 'header' | 'footer'
  className?: string
  children: React.ReactNode
}

/** Shared 1200px max-width + horizontal gutter for every section. */
export function Container({ as: Element = 'div', className, children }: ContainerProps) {
  return (
    <Element className={cn('mx-auto w-full max-w-[var(--container-page)] px-5 sm:px-6 lg:px-8', className)}>
      {children}
    </Element>
  )
}
