import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { projectStatusLabels, projectTypeLabels } from '@/features/projects/data/projectOptions'
import type { Project } from '@/features/projects/types/projectTypes'
import {
  projectConsultantTelHref,
  projectInspectionHref,
  projectWhatsAppHref,
} from '@/features/projects/utils/projectContact'

/**
 * The desktop summary column: price, the facts worth knowing, and the three
 * actions, held in view beside the long-form content.
 *
 * This is the desktop counterpart to `ProjectMobileContactBar`, which covers the
 * same three actions below `lg`. Neither is a substitute for the other — the
 * inline actions in the hero stay for the first impression, and this panel is
 * what a visitor has beside them once they start reading.
 *
 * `sticky` needs a stacking context on an ancestor, which `isolate` provides, and
 * the top offset clears the fixed navbar (72px phones / 80px from `lg` up) so the
 * panel does not slide underneath it while the page scrolls.
 */
export function ProjectDetailSidebar({ project }: { project: Project }) {
  const facts = [
    { id: 'status', label: 'Status', value: projectStatusLabels[project.status], icon: 'badge-check' as const },
    { id: 'type', label: 'Project Type', value: projectTypeLabels[project.projectType], icon: 'layers' as const },
    { id: 'units', label: 'Total Units', value: project.totalUnits.toLocaleString('en-NG'), icon: 'building-2' as const },
    {
      id: 'completion',
      label: project.status === 'completed' ? 'Completed' : 'Expected Completion',
      value: formatDate(project.completionDate),
      icon: project.status === 'completed' ? ('check-circle' as const) : ('calendar-check' as const),
    },
    { id: 'size', label: 'Development Size', value: project.developmentSize, icon: 'ruler' as const },
    { id: 'location', label: 'Location', value: project.location, icon: 'map-pin' as const },
  ]

  return (
    <div className="lg:col-span-4 xl:col-span-3">
      <div className="lg:sticky lg:top-28">
        <Reveal delay={120}>
          <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-md">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
              Starting Price
            </p>

            <p className="mt-1.5 font-display text-3xl font-bold leading-none text-ink-900">
              {formatCurrency(project.startingPrice)}
            </p>

            <p className="mt-2 text-xs text-ink-500">
              {project.availableUnits > 0
                ? `${project.availableUnits.toLocaleString('en-NG')} of ${project.totalUnits.toLocaleString('en-NG')} units available`
                : 'Fully allocated'}
            </p>

            <div className="mt-6 grid gap-2.5">
              <SidebarAction
                href={projectInspectionHref(project)}
                icon="calendar-check"
                label="Book an Inspection"
                primary
              />
              <SidebarAction href={projectWhatsAppHref(project)} icon="message" label="Enquire on WhatsApp" />
              <SidebarAction href={projectConsultantTelHref(project)} icon="phone" label="Call the Consultant" />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">Key Facts</h2>

            <dl className="mt-4 divide-y divide-sand-200">
              {facts.map((fact) => (
                <div key={fact.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="flex min-w-0 items-center gap-2 text-sm text-ink-500">
                    <Icon name={fact.icon} className="size-4 shrink-0 text-accent-500" strokeWidth={2} />
                    {fact.label}
                  </dt>
                  <dd className="shrink-0 text-right text-sm font-semibold text-ink-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </div>
  )
}

interface SidebarActionProps {
  href: string
  icon: Parameters<typeof Icon>[0]['name']
  label: string
  primary?: boolean
}

/**
 * A full-width action in the sidebar.
 *
 * The primary is the only filled orange button in the panel — the other two are
 * outlined — so there is one clear next step rather than three competing ones.
 */
function SidebarAction({ href, icon, label, primary = false }: SidebarActionProps) {
  return (
    <a
      href={href}
      className={
        primary
          ? 'flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-accent-700 active:bg-accent-800'
          : 'flex min-h-12 items-center justify-center gap-2 rounded-lg border border-sand-300 bg-white px-4 text-sm font-semibold text-ink-700 transition-colors duration-200 hover:border-accent-300 hover:bg-tint-50 hover:text-accent-700'
      }
    >
      <Icon name={icon} className="size-4" strokeWidth={2} />
      {label}
    </a>
  )
}
