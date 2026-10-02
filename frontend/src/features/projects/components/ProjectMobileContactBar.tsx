import { useEffect, useState } from 'react'

import { Icon } from '@/shared/components/ui/Icon'
import { cn } from '@/shared/lib/cn'
import type { Project } from '@/features/projects/types/projectTypes'
import { projectConsultantTelHref, projectInspectionHref, projectWhatsAppHref } from '@/features/projects/utils/projectContact'

interface ProjectMobileContactBarProps {
  project: Project
  /**
   * `id` of the element the bar should yield to.
   *
   * A bar that sits on top of the inspection form duplicates the action it covers
   * and hides the form's own submit button, so once that section is on screen the
   * bar gets out of the way. Falls back to always-visible if
   * `IntersectionObserver` is unavailable.
   */
  hideWhenVisibleId?: string
  className?: string
}

/**
 * Sticky contact bar for phones and small tablets.
 *
 * Hidden from `lg` up, where the hero actions and the sticky sidebar already
 * cover the same three options — three permanently visible buttons competing
 * with the content would be noise on a desktop.
 *
 * The three actions are equal-width thirds with one filled orange primary, so the
 * bar has a single obvious next step rather than three equal ones. Height is kept
 * at a 56px touch target, and `PROJECT_BAR_CLEARANCE` on the page reserves
 * exactly that much space so nothing is ever hidden behind it.
 *
 * Translates rather than removes itself when yielding to the inspection form, so
 * the layout cannot shift, and `inert` keeps the buttons out of the tab order
 * while hidden.
 */
export function ProjectMobileContactBar({
  project,
  hideWhenVisibleId = 'project-inspection',
  className,
}: ProjectMobileContactBarProps) {
  const [isYielding, setIsYielding] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const target = document.getElementById(hideWhenVisibleId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsYielding(entry.isIntersecting),
      // Show the bar again slightly before the section leaves, so it is back in
      // place by the time the closing CTA arrives.
      { rootMargin: '-72px 0px 25% 0px' },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [hideWhenVisibleId])

  const actions = [
    { id: 'whatsapp', label: 'WhatsApp', href: projectWhatsAppHref(project), icon: 'message' as const },
    { id: 'call', label: 'Call', href: projectConsultantTelHref(project), icon: 'phone' as const },
    {
      id: 'inspection',
      label: 'Book',
      fullLabel: 'Book Inspection',
      href: projectInspectionHref(project),
      icon: 'calendar-check' as const,
      primary: true,
    },
  ]

  return (
    <div
      data-project-contact-bar
      aria-hidden={isYielding}
      inert={isYielding}
      className={cn(
        // Fixed on small screens only, and lifted clear of the safe area on
        // notched devices so the home indicator does not overlap the buttons.
        'fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-white/95 backdrop-blur-md transition-transform duration-300 ease-[var(--ease-out-soft)] lg:hidden',
        'pb-[env(safe-area-inset-bottom)]',
        isYielding && 'translate-y-full',
        className,
      )}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-3">
        {actions.map((action) => (
          <li key={action.id}>
            <a
              href={action.href}
              data-contact-action={action.id}
              tabIndex={isYielding ? -1 : undefined}
              // The full label is the accessible name on a narrow bar where the
              // visible text has to be shortened to fit.
              aria-label={action.fullLabel ?? action.label}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 px-2 text-[0.6875rem] font-semibold transition-colors duration-200',
                action.primary
                  ? 'bg-accent-600 text-white active:bg-accent-700'
                  : 'text-ink-600 active:bg-tint-50',
              )}
            >
              <Icon name={action.icon} className="size-5" strokeWidth={2} />
              {action.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
