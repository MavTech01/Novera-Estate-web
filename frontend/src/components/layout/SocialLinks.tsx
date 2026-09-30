import { cn } from '../../lib/cn'
import type { SocialPlatform } from '../../types'
import { BrandIcon } from '../ui/BrandIcon'

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
            <BrandIcon name={platform.id} />
          </a>
        </li>
      ))}
    </ul>
  )
}
