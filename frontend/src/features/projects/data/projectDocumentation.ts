import type { ProjectDocumentation } from '@/features/projects/types/projectTypes'

/**
 * Documentation status for every development in the demo catalogue.
 *
 * Deliberately worded so it cannot be read as a verification claim. Nothing
 * here asserts that a title, survey or approval has been seen, checked or
 * confirmed by Novera Estates — the API will return the same
 * "available upon request" state until a real document record exists.
 */

const DOCUMENTATION_ENTRIES: ProjectDocumentation['entries'] = [
  { id: 'doc-type', label: 'Title / Survey', value: 'Available upon request' },
  { id: 'doc-planning', label: 'Planning Information', value: 'Available upon request' },
  { id: 'doc-development', label: 'Estate & Development Information', value: 'Available upon request' },
  { id: 'doc-reference', label: 'Development Reference', value: 'Issued on request' },
]

const DEMO_NOTE =
  'Documentation information is available upon request. Prospective buyers should independently verify all documentation and legal information before making a purchase.'

/**
 * One shared, immutable record for every project.
 *
 * A single object is enough because no field varies by development yet, and
 * sharing it avoids eleven identical copies drifting apart. The moment the API
 * returns per-project values this becomes a builder again — the type does not
 * change, so nothing above it has to move.
 */
export const projectDocumentation: ProjectDocumentation = {
  isDemo: true,
  note: DEMO_NOTE,
  entries: DOCUMENTATION_ENTRIES,
}
