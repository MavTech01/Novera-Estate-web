/**
 * Public surface of the About feature.
 *
 * The page imports from here rather than reaching into `components/`, `data/`
 * or `hooks/` directly, which keeps the feature's internals free to move. The
 * Locations and Projects features do the same.
 *
 * Only the page composition and the request hook are exported. Section
 * components, the demo data and the types are internal: a second consumer
 * should import them from here, not from their file paths.
 */

export { AboutCTA } from './components/AboutCTA'
export { AboutErrorState } from './components/AboutErrorState'
export { AboutSkeleton } from './components/AboutSkeleton'
export { CompanyIntroduction } from './components/CompanyIntroduction'
export { CompanyStory } from './components/CompanyStory'
export { CoreValues } from './components/CoreValues'
export { LocationsPreview } from './components/LocationsPreview'
export { MissionVision } from './components/MissionVision'
export { OurApproach } from './components/OurApproach'
export { PropertyConnection } from './components/PropertyConnection'
export { TeamCard } from './components/TeamCard'
export { TeamSection } from './components/TeamSection'
export { WhyNovera } from './components/WhyNovera'

export {
  findNotice,
  useAboutContent,
  type AboutRequestStatus,
  type AboutResource,
} from './hooks/useAboutData'

export { getAboutContent, preloadAboutContent } from './services/aboutService'

export type {
  AboutAccent,
  AboutApproachStep,
  AboutAudience,
  AboutCta,
  AboutHero as AboutHeroData,
  AboutHighlight,
  AboutIntroduction,
  AboutNotice,
  AboutPageContent,
  AboutPillar,
  AboutPillarId,
  AboutReason,
  AboutStory,
  AboutTeamMember,
  AboutTeamSocial,
  AboutValue,
} from './types/aboutTypes'