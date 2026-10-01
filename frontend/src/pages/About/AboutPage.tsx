import {
  AboutCTA,
  AboutErrorState,
  AboutHero,
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

  return (
    <main id="main-content" tabIndex={-1} className="focus:outline-none">
      <AboutHero hero={about.hero} />

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