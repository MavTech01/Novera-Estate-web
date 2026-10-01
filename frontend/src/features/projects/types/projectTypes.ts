import type { IconName, ImageAsset } from '@/types'

/**
 * Domain models for the Projects / Developments feature.
 *
 * These types mirror the shape `GET /api/projects` will return, so the demo
 * records in `../data/projects` can be swapped for API calls without any
 * component, hook or filter helper changing. Once the PERN backend lands the
 * projects, project_amenities and project_images tables map onto these types
 * one-to-one.
 */

/* -------------------------------------------------------------------------- */
/* Enumerations                                                               */
/* -------------------------------------------------------------------------- */

/** Lifecycle of a development, from marketing through to handover. */
export type ProjectStatus = 'completed' | 'ongoing' | 'upcoming'

/**
 * What kind of development a project is.
 *
 * Doubles as the "category" shown on the page — the category pills and the
 * "Project Type" select are two presentations of this single value, so the two
 * controls can never disagree.
 */
export type ProjectType = 'residential' | 'luxury-apartments' | 'estate' | 'commercial' | 'mixed-use'

/** The value used by the type facet when no type filter is applied. */
export type ProjectTypeFilter = ProjectType | 'all'

/** The value used by the status facet when no status filter is applied. */
export type ProjectStatusFilter = ProjectStatus | 'all'

/**
 * Controlled vocabulary for development amenities.
 *
 * `Project.features` stays free text for the detail page, but filtering and the
 * amenities grid need stable values — this becomes a `project_amenities` table.
 */
export type ProjectAmenity =
  | 'security'
  | 'gated-community'
  | 'parking'
  | 'green-spaces'
  | 'recreation'
  | 'power'
  | 'water'
  | 'cctv'
  | 'play-area'
  | 'lift'

/* -------------------------------------------------------------------------- */
/* Project                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * A single development as returned by `GET /api/projects`.
 *
 * `progress` and `unitsCompleted` are only meaningful while a development is
 * `ongoing`; they are `null` for upcoming and completed developments so the UI
 * can tell "not started" apart from "not reported".
 */
export interface Project {
  id: string
  /** URL slug — becomes the `/projects/:slug` route param. */
  slug: string
  name: string
  /** Human label, e.g. "Lekki Phase 1, Lagos". */
  location: string
  /** Key used by the location filter, e.g. "lekki-phase-1". */
  locationSlug: string
  city: string
  state: string
  projectType: ProjectType
  status: ProjectStatus
  /** Lowest unit price in naira. */
  startingPrice: number
  totalUnits: number
  availableUnits: number
  /** ISO date the development is expected to be handed over. */
  completionDate: string
  /** ISO date site works began, or null when work has not started. */
  constructionStarted: string | null
  /** 0–100, or null when no live progress applies. */
  progress: number | null
  /** Units finished to date, or null when no live progress applies. */
  unitsCompleted: number | null
  /** One line, used on cards and in search results. */
  summary: string
  /** Full copy, used on the detail page. */
  description: string
  images: ImageAsset[]
  amenities: ProjectAmenity[]
  features: string[]
  /** Site size as a human string, e.g. "1.8 hectares". */
  developmentSize: string
  /** Unit configurations offered in the scheme. */
  unitTypes: ProjectUnitType[]
  /** Address, surroundings and access notes. */
  locationInfo: ProjectLocationInfo
  /** Documentation status — deliberately never claims verification. */
  documentation: ProjectDocumentation
  /** Sales contact for this development. */
  consultant: ProjectConsultant
  isFeatured: boolean
  /** Demo-only flag: marks the record as sample data until the API is live. */
  isDemo: true
  /** ISO date, newest first. */
  createdAt: string
}

/* -------------------------------------------------------------------------- */
/* Detail-page records                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The authored shape of a project record.
 *
 * Everything on the detail page that follows mechanically from a project's
 * identity and figures — its unit configurations, surroundings, documentation
 * status and sales consultant — is derived by `withProjectDetails` rather than
 * typed eleven times in `../data/projects`.
 *
 * A future `GET /api/projects/:slug` returns these fields explicitly, so the
 * seed type describes the *mock* record, not the domain model. The `Project`
 * interface above is the contract everything else codes against.
 */
export type ProjectSeed = Omit<
  Project,
  'unitTypes' | 'locationInfo' | 'documentation' | 'consultant' | 'developmentSize'
>

/** One configuration of home offered within a development. */
export interface ProjectUnitType {
  id: string
  /** Marketing name, e.g. "3 Bedroom Terrace". */
  name: string
  bedrooms: number | null
  bathrooms: number | null
  /** Build area in square metres. */
  size: number
  /** Lowest price for this configuration, in naira. */
  startingPrice: number
  summary: string
  /** False once a configuration is fully allocated. */
  isAvailable: boolean
}

/** A nearby place, grouped by category. Never presented as a measured fact. */
export interface ProjectLandmark {
  id: string
  category: ProjectLandmarkCategory
  label: string
  icon: IconName
}

export type ProjectLandmarkCategory =
  | 'shopping'
  | 'schools'
  | 'healthcare'
  | 'roads'
  | 'business'
  | 'recreation'

/** How the site is reached. Descriptive only — no distances are asserted. */
export interface ProjectAccessNote {
  id: string
  label: string
  description: string
  icon: IconName
}

/** Why the location suits the kind of person the scheme is built for. */
export interface ProjectLocationHighlight {
  id: string
  title: string
  description: string
  icon: IconName
}

export interface ProjectLocationInfo {
  /** Scheme address, shown as text because no map service is wired up yet. */
  address: string
  /** Explains why a map placeholder rather than an embedded map. */
  mapNote: string
  nearby: ProjectLandmark[]
  accessibility: ProjectAccessNote[]
  highlights: ProjectLocationHighlight[]
}

export interface ProjectDocumentationEntry {
  id: string
  /** e.g. "Title", "Planning Permission", "Development Reference". */
  label: string
  /** Always availability wording rather than a claimed reference. */
  value: string
}

export interface ProjectDocumentation {
  /** True while these records are sample data and nothing is verified. */
  isDemo: true
  /** The caveat shown alongside the entries. */
  note: string
  entries: ProjectDocumentationEntry[]
}

/** The sales contact presented on the detail page. */
export interface ProjectConsultant {
  id: string
  name: string
  role: string
  phone: string
  phoneHref: string
  email: string
  emailHref: string
  /** wa.me number for this consultant. */
  whatsappHref: string
  avatar: ImageAsset
}


/* -------------------------------------------------------------------------- */
/* Filtering                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The complete filter state behind `/projects`.
 *
 * Every value is a primitive, which is what makes the state trivially
 * serialisable to a query string — the same shape `GET /api/projects` accepts.
 */
export interface ProjectFilters {
  /** Free-text match across name, location and description. */
  query: string
  /** A single location slug, or '' for every location. */
  location: string
  projectType: ProjectTypeFilter
  status: ProjectStatusFilter
}

/** A single removable filter, rendered as a chip above the grid. */
export interface ActiveProjectFilter {
  id: string
  label: string
  field: keyof ProjectFilters
}

/** Query parameters accepted by `getProjects()`. */
export type ProjectListQuery = ProjectFilters

/* -------------------------------------------------------------------------- */
/* Supporting records                                                         */
/* -------------------------------------------------------------------------- */

/** One tile in the categories strip. */
export interface ProjectCategory {
  value: ProjectTypeFilter
  label: string
  icon: IconName
}

/** Amenity presentation metadata: label, blurb and icon. */
export interface ProjectAmenityMeta {
  id: ProjectAmenity
  label: string
  description: string
  icon: IconName
}

/** One block in the "Why Choose a Novera Development" section. */
export interface ProjectBenefit {
  id: string
  title: string
  description: string
  icon: IconName
}

/** A promoted location and how many developments sit in it. */
export interface ProjectLocationSummary {
  slug: string
  name: string
  city: string
  state: string
  label: string
  description: string
  image: ImageAsset
  /** How many developments in the demo catalogue are in this location. */
  projectCount: number
}
