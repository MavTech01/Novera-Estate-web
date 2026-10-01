import { Container } from '@/shared/components/ui/Container'
import { Icon } from '@/shared/components/ui/Icon'
import { Reveal } from '@/shared/components/ui/Reveal'
import { Section } from '@/shared/components/ui/Section'
import { SectionHeading } from '@/shared/components/ui/SectionHeading'
import type { Project, ProjectLandmarkCategory } from '@/features/projects/types/projectTypes'

interface ProjectLocationProps {
  project: Project
}

const LANDMARK_LABELS: Record<ProjectLandmarkCategory, string> = {
  shopping: 'Shopping',
  schools: 'Schools',
  healthcare: 'Healthcare',
  roads: 'Roads & Transport',
  business: 'Business Districts',
  recreation: 'Recreation',
}

/** Ordered so the grid reads sensibly regardless of authoring order. */
const CATEGORY_ORDER: ProjectLandmarkCategory[] = [
  'roads',
  'business',
  'schools',
  'healthcare',
  'shopping',
  'recreation',
]

/**
 * "Project Location" — address, a map placeholder and the surrounding area.
 *
 * ⚠️ The map is deliberately a labelled placeholder rather than an embedded
 * provider. Wiring Google Maps or Mapbox needs an API key, a billing account and
 * a privacy policy for third-party location data — all out of scope for this
 * frontend phase. The placeholder states the address instead of pretending to
 * show a map.
 *
 * Nearby places are grouped and labelled as indicative, and no distances or
 * travel times are given, because none of this is geocoded or verified.
 */
export function ProjectLocation({ project }: ProjectLocationProps) {
  const { locationInfo } = project
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: locationInfo.nearby.filter((landmark) => landmark.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <Section tone="white">
      <Container>
        <SectionHeading
          eyebrow="Where it is"
          title="Project Location"
          description="Where the scheme sits and what surrounds it."
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Map placeholder */}
          <Reveal className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl border border-sand-200 bg-tint-100 shadow-sm">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #d8cfc2 1px, transparent 1px), linear-gradient(to bottom, #d8cfc2 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />

              <div className="relative flex aspect-[4/3] flex-col items-center justify-center px-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-pill bg-white text-accent-600 shadow-sm">
                  <Icon name="map-pinned" className="size-7" strokeWidth={1.75} />
                </span>

                <p className="mt-4 font-display text-lg text-ink-900">{project.location}</p>
                <p className="mt-1.5 text-sm text-ink-500">{locationInfo.address}</p>

                <p className="mt-5 max-w-sm text-xs leading-relaxed text-ink-400">
                  Map placeholder. An interactive map will be embedded here once the mapping service is
                  connected.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Address and access */}
          <Reveal delay={120} className="lg:col-span-2">
            <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 font-display text-base text-ink-900">
                <Icon name="navigation" className="size-4 text-accent-500" strokeWidth={2} />
                Getting here
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-ink-500">{locationInfo.address}</p>

              {locationInfo.accessibility.length > 0 && (
                <dl className="mt-6 space-y-5 border-t border-sand-200 pt-5">
                  {locationInfo.accessibility.map((note) => (
                    <div key={note.id} className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-pill bg-tint-50 text-accent-600">
                        <Icon name={note.icon} className="size-4" strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-sm font-semibold text-ink-900">{note.label}</dt>
                        <dd className="mt-1 text-xs leading-relaxed text-ink-500">{note.description}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </Reveal>
        </div>

        {/* Nearby */}
        {grouped.length > 0 && (
          <div className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display text-xl text-ink-900">Nearby</h3>
              <p className="text-xs text-ink-400">
                Indicative surroundings for a demonstration development — not verified or measured.
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {grouped.map((group) => (
                <div key={group.category} className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm">
                  <dt className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
                    <Icon
                      name={group.items[0].icon}
                      className="size-3.5 shrink-0 text-accent-500"
                      strokeWidth={2}
                    />
                    {LANDMARK_LABELS[group.category]}
                  </dt>
                  <dd className="mt-3">
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li key={item.id} className="text-sm leading-relaxed text-ink-600">
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Container>
    </Section>
  )
}
