/**
 * Public surface of the Projects feature.
 *
 * Pages import from here rather than reaching into `components/`, `data/` or
 * `hooks/` directly, which keeps the feature's internals free to move.
 */

export { FeaturedProject } from './components/FeaturedProject'
export { PrimeLocations } from './components/PrimeLocations'
export { ProjectActiveFilters } from './components/ProjectActiveFilters'
export { ProjectAmenities } from './components/ProjectAmenities'
export { ProjectCard } from './components/ProjectCard'
export { ProjectCardSkeleton, ProjectGridSkeleton } from './components/ProjectCardSkeleton'
export { ProjectCategoryFilter } from './components/ProjectCategoryFilter'
export { ProjectContactCta } from './components/ProjectContactCta'
export { ProjectConsultantCard } from './components/ProjectConsultantCard'
export { ProjectDemoNotice } from './components/ProjectDemoNotice'
export { ProjectDescription } from './components/ProjectDescription'
export { ProjectDetailsSkeleton } from './components/ProjectDetailsSkeleton'
export { ProjectDetailHero } from './components/ProjectDetailHero'
export { ProjectDocumentation } from './components/ProjectDocumentation'
export { ProjectEmptyState } from './components/ProjectEmptyState'
export { ProjectErrorState } from './components/ProjectErrorState'
export { ProjectFeatures } from './components/ProjectFeatures'
export { ProjectGallery } from './components/ProjectGallery'
export { ProjectGrid } from './components/ProjectGrid'
export { ProjectHero } from './components/ProjectHero'
export { ProjectInspectionForm } from './components/ProjectInspectionForm'
export { ProjectLocation } from './components/ProjectLocation'
export { ProjectLocationCard } from './components/ProjectLocationCard'
export { ProjectLocationHighlights } from './components/ProjectLocationHighlights'
export { ProjectMobileContactBar } from './components/ProjectMobileContactBar'
export { ProjectMobileFilterDrawer } from './components/ProjectMobileFilterDrawer'
export { ProjectOverview } from './components/ProjectOverview'
export { ProjectProgress } from './components/ProjectProgress'
export { ProjectRelatedProperties } from './components/ProjectRelatedProperties'
export { ProjectResultsHeader } from './components/ProjectResultsHeader'
export { ProjectSearchForm } from './components/ProjectSearchForm'
export { ProjectStatusBadge } from './components/ProjectStatusBadge'
export { ProjectUnitTypes } from './components/ProjectUnitTypes'
export { ProjectsClosingCta } from './components/ProjectsClosingCta'
export { WhyChooseNovera } from './components/WhyChooseNovera'

export { useProjectFilters, type ProjectFiltersController } from './hooks/useProjectFilters'
export { useProject } from './hooks/useProject'
export {
  useProjectResource,
  type ProjectRequestStatus,
  type ProjectResource,
} from './hooks/useProjectResource'
export { useRelatedProperties } from './hooks/useRelatedProperties'
export {
  useProjects,
  useAllProjects,
  useFeaturedProject,
  useProjectCountsByLocation,
  useProjectLocations,
} from './hooks/useProjects'

export { getProjectBySlug, getAllProjects, getProjectCountsByLocationSlug } from './services/projectService'

// `ProjectDocumentation` is the section component above; the record type it
// renders is internal to the feature and is not re-exported under the same name.
export type {
  ActiveProjectFilter,
  Project,
  ProjectAmenity,
  ProjectConsultant,
  ProjectDocumentationEntry,
  ProjectFilters,
  ProjectLandmark,
  ProjectLandmarkCategory,
  ProjectLocationHighlight,
  ProjectLocationInfo,
  ProjectLocationSummary,
  ProjectSeed,
  ProjectStatus,
  ProjectStatusFilter,
  ProjectType,
  ProjectTypeFilter,
  ProjectUnitType,
} from './types/projectTypes'
