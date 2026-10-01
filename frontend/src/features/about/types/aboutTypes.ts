import type { IconName, ImageAsset, SocialPlatform } from '@/types'

/**
 * Domain models for the About feature.
 *
 * These types mirror what `GET /api/about` will return, so the demo records in
 * `../data/aboutData` can be swapped for that call without a single component,
 * hook or selector changing. Once the PERN backend lands, `company_profile`
 * covers the hero and introduction, `about_story` the narrative, `about_values`
 * and `about_reasons` their respective grids, `about_approach_steps` the process
 * and `agents` the team roster.
 *
 * Two things are deliberately absent from every type here:
 *
 *  - **Metrics.** No years-in-business, listing counts, client totals, awards or
 *    rankings. Those are claims that need verified data behind them, so the page
 *    makes none and there is nowhere here to put one by accident.
 *  - **Hard biographical facts** — a founding year, named founders, office
 *    counts. Where the page needs something of that shape it uses an explicit
 *    placeholder flag (`isPlaceholder`) so sample copy can never be published
 *    while reading as a record.
 */

/* -------------------------------------------------------------------------- */
/* Enumerations                                                               */
/* -------------------------------------------------------------------------- */

/** The two statements shown side by side in the Mission & Vision section. */
export type AboutPillarId = 'mission' | 'vision'

/** A prominent, tappable action rendered inside a section. */
export interface AboutCta {
  label: string
  /** Resolved from `shared/lib/routes` rather than typed as a literal path. */
  href: string
  icon?: IconName
}

/** A short "proof point" line — a capability, not a statistic. */
export interface AboutHighlight {
  id: string
  label: string
  description: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

/** Everything above the fold: the promise, one photograph, two actions. */
export interface AboutHero {
  eyebrow: string
  title: string
  description: string
  image: ImageAsset
  highlights: AboutHighlight[]
  primaryCta: AboutCta
  secondaryCta: AboutCta
}

/* -------------------------------------------------------------------------- */
/* Introduction                                                               */
/* -------------------------------------------------------------------------- */

/** The "who we are and how we work" block beneath the hero. */
export interface AboutIntroduction {
  eyebrow: string
  title: string
  paragraphs: string[]
  image: ImageAsset
  /** Who the company works with — buyers, renters, investors, owners. */
  audiences: AboutAudience[]
  /** The small secondary card that sits against the main image. */
  accent: AboutAccent
}

/** One group of people the company serves. */
export interface AboutAudience {
  id: string
  label: string
  description: string
  icon: IconName
}

/** A short secondary statement, used as a visual accent rather than a claim. */
export interface AboutAccent {
  title: string
  description: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* Story                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The "Our Story" narrative.
 *
 * `isPlaceholder` is the important field. The copy describes intent — what the
 * brand set out to do — rather than asserting an unverifiable history, and the
 * flag is what lets the CMS later supply real milestones without the section
 * needing to change shape.
 */
export interface AboutStory {
  eyebrow: string
  title: string
  paragraphs: string[]
  image: ImageAsset
  /** What the story is built around. Purely presentational. */
  pillars: string[]
  /**
   * True while the historical detail is placeholder copy.
   *
   * The UI surfaces `placeholderNote` while this is set, so an unedited demo
   * cannot pass for a company history.
   */
  isPlaceholder: boolean
  placeholderNote: string | null
}

/* -------------------------------------------------------------------------- */
/* Mission & Vision                                                           */
/* -------------------------------------------------------------------------- */

/**
 * One half of the Mission & Vision pair.
 *
 * `points` is a short list rather than free prose so each card stays scannable;
 * the service returns them pre-shaped and the card never parses strings.
 */
export interface AboutPillar {
  id: AboutPillarId
  title: string
  summary: string
  points: string[]
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* Values and reasons                                                         */
/* -------------------------------------------------------------------------- */

/** A core value — the standard a team holds itself to. */
export interface AboutValue {
  id: string
  title: string
  description: string
  icon: IconName
}

/**
 * A reason to choose Novera Estates.
 *
 * Describes how the company works, never how it compares. Nothing here may be
 * written as a ranking or a claim of superiority — a differentiator that cannot
 * be substantiated is the fastest way to lose a buyer's trust.
 */
export interface AboutReason {
  id: string
  title: string
  description: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* Approach                                                                   */
/* -------------------------------------------------------------------------- */

/** One numbered stage of the client journey. */
export interface AboutApproachStep {
  id: string
  /** Short marker rendered as the step number, e.g. "01". */
  step: string
  title: string
  description: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* Team                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A profile in the team grid.
 *
 * Every record is `isDemo: true`. Novera Estates is a demo build, so these are
 * placeholder profiles rather than real staff — the section renders a visible
 * notice to that effect, and this flag is what drives it. When the API is
 * connected, the records come from the `agents` table with real photography and
 * real contact details, and the notice is dropped from the response.
 */
export interface AboutTeamMember {
  id: string
  name: string
  role: string
  description: string
  avatar: ImageAsset
  /** Short area labels, e.g. "Residential sales", "Land advisory". */
  focusAreas: string[]
  socials?: AboutTeamSocial[]
  isDemo: true
}

/** A team member's public profile link. */
export interface AboutTeamSocial {
  id: SocialPlatform
  label: string
  href: string
}

/* -------------------------------------------------------------------------- */
/* Notices                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * An inline disclosure that some part of the page is sample content.
 *
 * Modelled as data rather than hard-coded copy so the wording lives with the
 * content it qualifies, and so a section can be dropped by removing its entry
 * once the real records are live.
 */
export interface AboutNotice {
  id: string
  message: string
  icon: IconName
}

/* -------------------------------------------------------------------------- */
/* Page aggregate                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The whole About page as one record — what `GET /api/about` returns.
 *
 * Grouped by section rather than flattened so each component can take exactly
 * the slice it renders, and so a CMS can publish the sections independently.
 */
export interface AboutPageContent {
  hero: AboutHero
  introduction: AboutIntroduction
  story: AboutStory
  mission: AboutPillar
  vision: AboutPillar
  values: AboutValue[]
  reasons: AboutReason[]
  approach: AboutApproachStep[]
  team: AboutTeamMember[]
  notices: AboutNotice[]
}