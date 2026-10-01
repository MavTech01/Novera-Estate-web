import { cn } from '@/shared/lib/cn'
import type { SocialPlatform } from '@/types'
import { BrandIcon } from '@/shared/components/ui/BrandIcon'

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
            className="flex size-11 items-center justify-center rounded-pill border border-white/15 bg-white/10 text-sand-200 transition-colors duration-200 hover:border-accent-500 hover:bg-accent-600 hover:text-white"
          >
            <BrandIcon name={platform.id} className="!size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}
