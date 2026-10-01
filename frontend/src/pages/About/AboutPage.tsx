import {
  AboutCTA,
  AboutErrorState,
  AboutSkeleton,
  CompanyIntroduction,
  CompanyStory,
  CoreValues,
  LocationsPreview,
  MissionVision,
  OurApproach,
  PropertyConnection,
  TeamSection,
  WhyNovera,
  findNotice,
  useAboutContent,
} from '@/features/about'
import { Icon } from '@/shared/components/ui/Icon'
import { PageHero } from '@/shared/components/layout/PageHero'
import { pageCrumbs } from '@/shared/lib/breadcrumbs'

/**
 * About page — who Novera Estates is, and where to go next.
 *
 * Deliberately thin, mirroring `LocationsPage` and `ProjectsPage`: the service
 * owns the request, `useAboutContent` owns the lifecycle, and this file only
 * decides which section renders for which state. Section order can change
 * without touching the data layer.
 *
 * The page is one continuous read — hero, story, mission and vision, values,
 * approach, team, areas — followed by the two sections that hand a visitor off
 * to the Properties and Locations features. Nothing here reaches for data of its
 * own, so replacing `aboutService`'s body with `fetch('/api/about')` swaps the
 * whole page over without editing a component.
 *
 * Tones alternate so consecutive sections never blend: warm hero → white →
 * tint → white → tint → warm → white → tint → white.
 */
export function AboutPage() {
  const { value: about, status, error, retry } = useAboutContent()

  if (status === 'error') {
    return (
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <AboutErrorState message={error ?? 'Something went wrong while loading this page.'} onRetry={retry} />
      </main>
    )
  }

  if (!about) {
    return (
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <AboutSkeleton />
      </main>
    )
  }

  const { hero } = about

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <PageHero
        headingId="about-hero-heading"
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
        breadcrumbs={pageCrumbs({ label: 'About' })}
        actions={[
          { label: hero.primaryCta.label, href: hero.primaryCta.href, withArrow: true },
          {
            label: hero.secondaryCta.label,
            href: hero.secondaryCta.href,
            variant: 'outline',
            icon: hero.secondaryCta.icon,
          },
        ]}
        meta={hero.highlights.map((highlight) => (
          <span key={highlight.id} className="flex items-center gap-2">
            <Icon name={highlight.icon} className="size-4 text-accent-300" strokeWidth={2} />
            {highlight.label}
          </span>
        ))}
      />

      <CompanyIntroduction introduction={about.introduction} />

      <CompanyStory story={about.story} notice={findNotice(about.notices, 'story-placeholder')} />

      <MissionVision mission={about.mission} vision={about.vision} />

      <CoreValues values={about.values} />

      <WhyNovera reasons={about.reasons} />

      <OurApproach steps={about.approach} />

      <TeamSection team={about.team} notices={about.notices} />

      <LocationsPreview />

      <PropertyConnection />

      <AboutCTA />
    </main>
  )
}