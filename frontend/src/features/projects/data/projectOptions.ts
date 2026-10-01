import { featuredLocations } from '@/data/locations'
import type { IconName } from '@/types'
import type { ProjectCategory, ProjectStatus, ProjectStatusFilter, ProjectType, ProjectTypeFilter } from '@/features/projects/types/projectTypes'

/**
 * Static taxonomies for the Projects feature.
 *
 * Filter metadata lives here rather than inside components so the hero select,
 * the category strip, the mobile drawer and the URL serialiser all read the
 * same single source of truth. In PostgreSQL this becomes a lookup table.
 */

/** Every project type, in display order. */
export const projectTypes: readonly ProjectType[] = [
  'residential',
  'luxury-apartments',
  'estate',
  'commercial',
  'mixed-use',
] as const

/** Every project status, in lifecycle order. */
export const projectStatuses: readonly ProjectStatus[] = ['completed', 'ongoing', 'upcoming'] as const

export const projectTypeLabels: Record<ProjectType, string> = {
  residential: 'Residential',
  'luxury-apartments': 'Luxury Apartments',
  estate: 'Estate Developments',
  commercial: 'Commercial',
  'mixed-use': 'Mixed Use',
}

/** Short label used where the full name will not fit, e.g. on a card. */
export const projectTypeShortLabels: Record<ProjectType, string> = {
  residential: 'Residential',
  'luxury-apartments': 'Luxury Apartments',
  estate: 'Estate',
  commercial: 'Commercial',
  'mixed-use': 'Mixed Use',
}

export const projectStatusLabels: Record<ProjectStatus, string> = {
  completed: 'Completed',
  ongoing: 'Ongoing',
  upcoming: 'Upcoming',
}

export const projectStatusIcons: Record<ProjectStatus, IconName> = {
  completed: 'check-circle',
  ongoing: 'construction',
  upcoming: 'calendar',
}

/** Label shown in the "status" select. */
export const projectStatusFilterLabels: Record<ProjectStatusFilter, string> = {
  all: 'Any Status',
  completed: 'Completed',
  ongoing: 'Ongoing',
  upcoming: 'Upcoming',
}

/**
 * The category strip below the hero.
 *
 * The "All Projects" tile maps to the same `'all'` value the type filter uses,
 * so clicking a category and picking a type in the search form can never
 * disagree — they are two views of one piece of state.
 */
export const projectCategories: readonly ProjectCategory[] = [
  { value: 'all', label: 'All Projects', icon: 'building-2' },
  { value: 'residential', label: 'Residential', icon: 'house' },
  { value: 'luxury-apartments', label: 'Luxury Apartments', icon: 'sparkles' },
  { value: 'estate', label: 'Estate Developments', icon: 'layers' },
  { value: 'commercial', label: 'Commercial', icon: 'store' },
  { value: 'mixed-use', label: 'Mixed Use', icon: 'building-2' },
] as const

/** Options for the "Project Type" select, including the pass-through value. */
export const projectTypeOptions: { value: ProjectTypeFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  ...projectTypes.map((value) => ({ value, label: projectTypeLabels[value] })),
]

/** Options for the "Project Status" select, including the pass-through value. */
export const projectStatusOptions: { value: ProjectStatusFilter; label: string }[] = [
  { value: 'all', label: 'Any Status' },
  ...projectStatuses.map((value) => ({ value, label: projectStatusLabels[value] })),
]

/**
 * Locations promoted in the "Developments in Prime Locations" section.
 *
 * The location records themselves are shared with the properties feature (one
 * canonical list for all of Lagos); the Projects feature only adds the project
 * count, which it derives from the catalogue at runtime.
 */
export const primeLocations = featuredLocations
