import { cn } from '../../lib/cn'
import type { BrandIconName } from '../../types'

/**
 * Brand mark registry.
 *
 * Social platforms and WhatsApp have no equivalent in the generic icon set, so
 * they are drawn here as inline paths. Data files reference them by name and no
 * component imports an icon library directly.
 */
const paths: Record<BrandIconName, React.ReactNode> = {
  facebook: (
    <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H8v2.8h2.5v7h3Z" />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.8" cy="7.4" r="1.05" />
    </>
  ),
  linkedin: (
    <path d="M7.2 9.6H4.4V20h2.8V9.6ZM5.8 4.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.7c0-2.6-1.4-3.9-3.3-3.9-1.5 0-2.2.8-2.6 1.4V9.6H11.3V20h2.8v-5.4c0-1.4.3-2.8 2-2.8s1.9 1.4 1.9 2.9V20h2.8l.2-6.3Z" />
  ),
  x: (
    <path d="M17.2 4h2.8l-6.1 7 7.2 9h-5.6l-4.4-5.7L5.9 20H3.1l6.5-7.4L2.7 4h5.7l4 5.3L17.2 4Zm-1 14.3h1.5L7.9 5.6H6.3l9.9 12.7Z" />
  ),
  whatsapp: (
    <path d="M12 3.2A8.8 8.8 0 0 0 4.3 16.2L3.2 20.8l4.7-1.1A8.8 8.8 0 1 0 12 3.2Zm0 2.1a6.7 6.7 0 1 1-3.4 12.3l-.3-.2-2.4.6.6-2.3-.2-.3A6.7 6.7 0 0 1 12 5.3Zm-3 3.2c-.2 0-.4 0-.6.3-.2.2-.7.7-.7 1.7s.7 2 .8 2.1c.1.2 1.4 2.1 3.4 2.9 1.7.7 2 .6 2.4.5.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.2-.2-.4-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a5.5 5.5 0 0 1-1.6-1 6 6 0 0 1-1.1-1.4c-.1-.2 0-.4.1-.5l.4-.5.3-.5v-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5Z" />
  ),
}

interface BrandIconProps {
  name: BrandIconName
  className?: string
  /** Outline variant for buttons on dark surfaces. */
  outlined?: boolean
}

export function BrandIcon({ name, className, outlined = false }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      fill={outlined ? 'none' : 'currentColor'}
      className={cn('size-[1.15rem]', className)}
    >
      {paths[name]}
    </svg>
  )
}
