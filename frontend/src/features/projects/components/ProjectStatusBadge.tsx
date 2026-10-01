import { Badge, type BadgeTone } from '@/shared/components/ui/Badge'
import { cn } from '@/shared/lib/cn'
import { projectStatusIcons, projectStatusLabels } from '@/features/projects/data/projectOptions'
import type { ProjectStatus } from '@/features/projects/types/projectTypes'

/**
 * Tone pairs per status.
 *
 * `inline` sits on a white or tinted surface; `overlay` sits on photography and
 * therefore needs solid, high-contrast fills rather than a hairline border.
 * Status is always carried by an icon and a word as well as a colour, so it is
 * never communicated by colour alone.
 */
const inlineTones: Record<ProjectStatus, BadgeTone> = {
  completed: 'success',
  ongoing: 'dark',
  upcoming: 'outline',
}

const overlayTones: Record<ProjectStatus, BadgeTone> = {
  completed: 'success',
  ongoing: 'dark',
  upcoming: 'light',
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
  /** `overlay` is for photography, `inline` for white and tinted surfaces. */
  variant?: 'inline' | 'overlay'
  className?: string
}

/** The status pill shown on cards, in the featured panel and on detail pages. */
export function ProjectStatusBadge({
  status,
  variant = 'inline',
  className,
}: ProjectStatusBadgeProps) {
  const tones = variant === 'overlay' ? overlayTones : inlineTones

  return (
    <Badge
      tone={tones[status]}
      icon={projectStatusIcons[status]}
      className={cn(variant === 'overlay' && 'shadow-sm', className)}
    >
      {projectStatusLabels[status]}
    </Badge>
  )
}
