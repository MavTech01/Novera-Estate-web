import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import type { IconName } from '@/types'
import type { Project } from '@/features/projects/types/projectTypes'
import { projectConsultantTelHref, projectInspectionHref, projectWhatsAppHref } from '@/features/projects/utils/projectContact'

interface ProjectContactCtaProps {
  project: Project
}

/**
 * Closing call to action.
 *
 * Repeats the three ways to get in touch rather than the hero's two, because by
 * this point the visitor has read the whole page and the consultant's number is
 * the natural next thing to want. Sits on a dark band to close the page with a
 * clear end rather than trailing off after related properties.
 */
export function ProjectContactCta({ project }: ProjectContactCtaProps) {
  const actions: { id: string; label: string; icon: IconName }[] = [
    { id: 'whatsapp', label: 'Enquire on WhatsApp', icon: 'message' },
    { id: 'call', label: 'Call the consultant', icon: 'phone' },
    { id: 'inspection', label: 'Book an inspection', icon: 'calendar-check' },
  ]

  return (
    <Section tone="brown" spacing="tight">
      <Container>
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
            {project.location}
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-display text-2xl leading-tight text-white sm:text-3xl">
            Interested in {project.name}?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Talk to a Novera consultant about unit types, payment plans and inspection dates. We reply to
            every enquiry.
          </p>

          {/* All three actions reachable without scrolling on a phone. */}
          <ul className="mx-auto mt-9 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {actions.map((action) => {
              const href =
                action.id === 'whatsapp'
                  ? projectWhatsAppHref(project)
                  : action.id === 'call'
                    ? projectConsultantTelHref(project)
                    : projectInspectionHref(project)

              return (
                <li key={action.id}>
                  <ButtonLink
                    href={href}
                    variant="onBrown"
                    size="lg"
                    className="w-full"
                  >
                    <Icon name={action.icon} className="size-4" strokeWidth={2} />
                    {action.label}
                  </ButtonLink>
                </li>
              )
            })}
          </ul>

          <p className="mt-8 flex flex-col items-center justify-center gap-1.5 text-xs text-white/50 sm:flex-row sm:gap-3">
            <span>{project.consultant.name}</span>
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
            <a
              href={`mailto:${project.consultant.emailHref}`}
              // Inline in a sentence, but padded to a 24px tap area to satisfy
              // WCAG 2.5.8 without loosening the type size.
              className="py-1 transition-colors duration-200 hover:text-white"
            >
              {project.consultant.email}
            </a>
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
