import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import { PROJECT_DEMO_NOTICE } from '@/features/projects/data/projectContent'

interface ProjectDemoNoticeProps {
  className?: string
}

/**
 * States plainly that the catalogue is sample data.
 *
 * Until the API is connected the developments on this page are fictional, and
 * placeholder names, prices and progress figures must not read as live
 * inventory — so the notice sits directly above the listings rather than being
 * buried in a legal page.
 */
export function ProjectDemoNotice({ className }: ProjectDemoNoticeProps) {
  return (
    <p
      className={cn(
        'flex items-start gap-2.5 rounded-md border border-sand-200 bg-sand-100 px-4 py-3 text-xs leading-relaxed text-ink-600',
        className,
      )}
    >
      <Icon name="file-text" className="mt-0.5 size-4 shrink-0 text-accent-600" strokeWidth={2} />
      <span>{PROJECT_DEMO_NOTICE}</span>
    </p>
  )
}
