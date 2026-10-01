import { ButtonLink } from '@/shared/components/ui/Button'
import { Icon } from '@/shared/components/ui/Icon'
import { SkeletonImage } from '@/shared/components/ui/SkeletonImage'
import type { Project } from '@/features/projects/types/projectTypes'
import { projectConsultantTelHref, projectWhatsAppHref } from '@/features/projects/utils/projectContact'

interface ProjectConsultantCardProps {
  project: Project
  className?: string
}

/**
 * "Your Consultant" — the named contact for this development.
 *
 * A person with a name, portrait and direct line, rather than a generic "Contact
 * Us" panel: an enquiry about a specific scheme is specific, and giving the
 * visitor a named consultant is what makes it feel answerable.
 *
 * ⚠️ Fictional person. The photograph, phone and email come from the demo
 * catalogue and the WhatsApp number is an unroutable `+234 000…` placeholder.
 */
export function ProjectConsultantCard({ project, className }: ProjectConsultantCardProps) {
  const { consultant } = project

  return (
    <div className={className}>
      <div className="flex items-start gap-3 border-b border-sand-200 pb-3">
        <Icon name="users" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
        <h3 className="font-display text-base text-ink-900">Your Consultant</h3>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <SkeletonImage
          src={consultant.avatar.src}
          alt={consultant.avatar.alt}
          width={160}
          height={160}
          className="size-16 shrink-0 rounded-pill"
        />

        <div className="min-w-0">
          <p className="font-display text-base leading-snug text-ink-900">{consultant.name}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{consultant.role}</p>
        </div>
      </div>

      {/* Direct lines. `tel:` so a phone dials rather than copying a number. */}
      <ul className="mt-5 space-y-1">
        <li>
          <a
            href={projectConsultantTelHref(project)}
            // `py-1` widens the row into a comfortable tap area that clears the
            // 24px minimum in WCAG 2.5.8, not just the icon and digits.
            className="flex min-h-6 items-center gap-2.5 py-1 text-sm text-ink-600 transition-colors duration-200 hover:text-accent-700"
          >
            <Icon name="phone" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
            {consultant.phone}
          </a>
        </li>

        <li>
          <a
            href={`mailto:${consultant.emailHref}`}
            className="flex min-h-6 items-center gap-2.5 break-all py-1 text-sm text-ink-600 transition-colors duration-200 hover:text-accent-700"
          >
            <Icon name="mail" className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
            {consultant.email}
          </a>
        </li>
      </ul>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <ButtonLink href={projectWhatsAppHref(project)} variant="accent" size="sm" className="w-full">
          <Icon name="message" className="size-4" strokeWidth={2} />
          WhatsApp
        </ButtonLink>

        <ButtonLink href={projectConsultantTelHref(project)} variant="outline" size="sm" className="w-full">
          <Icon name="phone" className="size-4" strokeWidth={2} />
          Call
        </ButtonLink>
      </div>
    </div>
  )
}
