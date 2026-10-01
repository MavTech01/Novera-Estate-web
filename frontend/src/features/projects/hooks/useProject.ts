import { useMemo } from 'react'

import { useProjectResource } from './useProjectResource'
import { getProjectBySlug, readProjectBySlug } from '@/features/projects/services/projectService'
import { projectDetailQueryKey } from '@/features/projects/utils/projectUtils'

/**
 * State for a single project, driven by the route's `slug`.
 *
 * All request handling lives in `useProjectResource` — shared with the listing
 * hooks so a project detail page and the projects grid fail, retry and cache in
 * exactly the same way. This hook only says *what* to load.
 *
 * `value` is `null` for a slug that resolves to nothing, which is deliberately
 * distinct from `status === 'error'`: an unknown slug is a not-found page, a
 * failed request is an error state, and the two are not the same message.
 */
export function useProject(slug: string) {
  const queryKey = useMemo(() => projectDetailQueryKey(slug), [slug])

  // Seeded from the service cache so a route preload (or a return visit) paints
  // the development on the first frame instead of showing skeletons again.
  const project = useProjectResource(
    () => getProjectBySlug(slug),
    queryKey,
    null,
    () => readProjectBySlug(slug),
  )

  return {
    project: project.value,
    loading: project.status === 'loading',
    error: project.error,
    status: project.status,
    /** True when the previous project's data is still on screen. */
    isStale: project.isStale,
    retry: project.retry,
  }
}
