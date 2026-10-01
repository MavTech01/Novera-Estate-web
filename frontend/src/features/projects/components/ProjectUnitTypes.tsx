import { ButtonLink } from '@/shared/components/ui/Button'
import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import { formatCurrency } from '@/shared/lib/format'
import type { IconName } from '@/types'
import type { Project, ProjectUnitType } from '@/features/projects/types/projectTypes'
import { projectInquiryHref } from '@/features/projects/utils/projectContact'

interface ProjectUnitTypesProps {
  project: Project
}

/**
 * "Available Unit Types" — the configurations offered in the scheme.
 *
 * Reusable: it takes `unitTypes` off the project record and knows nothing about
 * how they were produced, so an API payload can replace the derived set without
 * this component changing.
 */
export function ProjectUnitTypes({ project }: ProjectUnitTypesProps) {
  if (project.unitTypes.length === 0) return null

  return (
    <Section tone="tint">
      <Container>
        <SectionHeading
          eyebrow="What you can choose from"
          title="Available Unit Types"
          description="Configurations currently planned for this development. Prices are demonstration figures."
        />

        <ul className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {project.unitTypes.map((unitType, index) => (
            <li key={unitType.id} className="flex">
              <Reveal
                delay={index * 90}
                className="flex h-full w-full flex-col rounded-xl border border-sand-200 bg-white p-6 shadow-sm transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-accent-200 hover:shadow-md"
              >
                <UnitTypeHeader unitType={unitType} />
                <UnitTypeSpecs unitType={unitType} />

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-500">{unitType.summary}</p>

                <div className="mt-6 border-t border-sand-200 pt-5">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                    From
                  </p>
                  <p className="mt-1 font-display text-xl font-bold leading-none text-ink-900">
                    {formatCurrency(unitType.startingPrice)}
                  </p>
                </div>

                {unitType.isAvailable ? (
                  <ButtonLink
                    href={projectInquiryHref(project)}
                    variant="outline"
                    className="mt-5 w-full"
                    withArrow
                  >
                    Request Details
                  </ButtonLink>
                ) : (
                  <p className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-md border border-sand-200 bg-sand-100 px-4 text-sm font-semibold text-ink-500">
                    <Icon name="clock" className="size-4" strokeWidth={2} />
                    Allocation closed
                  </p>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

/** Name plus the availability pill. */
function UnitTypeHeader({ unitType }: { unitType: ProjectUnitType }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-display text-lg leading-snug text-ink-900">{unitType.name}</h3>
      {!unitType.isAvailable && (
        <span className="shrink-0 rounded-pill bg-sand-100 px-2.5 py-1 text-[0.6875rem] font-semibold text-ink-500">
          Allocated
        </span>
      )}
    </div>
  )
}

/** Bedrooms / bathrooms / size. Commercial units have neither bed nor bath count. */
function UnitTypeSpecs({ unitType }: { unitType: ProjectUnitType }) {
  const specs: { id: string; label: string; icon: IconName }[] = []

  if (unitType.bedrooms !== null) {
    specs.push({ id: 'beds', label: `${unitType.bedrooms} Bedrooms`, icon: 'bed' })
  }

  if (unitType.bathrooms !== null) {
    specs.push({ id: 'baths', label: `${unitType.bathrooms} Bathrooms`, icon: 'bath' })
  }

  specs.push({ id: 'size', label: `${unitType.size} sqm`, icon: 'ruler' })

  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      {specs.map((spec) => (
        <li key={spec.id} className="flex items-center gap-1.5 text-xs font-semibold text-ink-600">
          <Icon name={spec.icon} className="size-3.5 shrink-0 text-accent-500" strokeWidth={2} />
          {spec.label}
        </li>
      ))}
    </ul>
  )
}
