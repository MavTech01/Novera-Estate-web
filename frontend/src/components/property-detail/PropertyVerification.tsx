import { cn } from '../../lib/cn'
import { Badge } from '../ui/Badge'
import { Icon } from '../ui/Icon'

interface PropertyVerificationProps {
  isVerified: boolean
  className?: string
}

/**
 * Review marker for a listing.
 * Shown only when the record carries `isVerified`, and labelled as demo data so
 * the badge is never read as a claim about a real property.
 */
export function PropertyVerification({ isVerified, className }: PropertyVerificationProps) {
  if (!isVerified) return null

  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-xl border border-success-100 bg-success-100/40 p-5',
        className,
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-white text-success-600 shadow-sm">
        <Icon name="badge-check" className="size-5" strokeWidth={1.75} />
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-base text-ink-900">Verified Property</p>
          <Badge tone="outline" className="px-2.5 py-0.5 text-[0.6875rem]">
            Demo
          </Badge>
        </div>

        <p className="mt-1 text-sm leading-relaxed text-ink-600">
          Property information has been reviewed by Novera Estates.
        </p>
      </div>
    </div>
  )
}
