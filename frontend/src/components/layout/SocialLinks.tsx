import { cn } from '../../lib/cn'
import type { SocialPlatform } from '../../types'

const paths: Record<SocialPlatform, React.ReactNode> = {
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
}

interface SocialLinksProps {
  platforms: { id: SocialPlatform; label: string; href: string }[]
  className?: string
}

export function SocialLinks({ platforms, className }: SocialLinksProps) {
  return (
    <ul className={cn('flex items-center gap-2', className)}>
      {platforms.map((platform) => (
        <li key={platform.id}>
          <a
            href={platform.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${platform.label} (opens in a new tab)`}
            className="flex size-11 items-center justify-center rounded-pill text-sand-300 transition-colors duration-200 hover:bg-accent-600 hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden fill="currentColor" className="size-[1.15rem]">
              {paths[platform.id]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
