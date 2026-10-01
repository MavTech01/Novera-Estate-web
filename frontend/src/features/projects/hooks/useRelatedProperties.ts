import { useEffect, useState } from 'react'

import {
  fetchProperties,
  readProperties,
  type PropertyListingPage,
} from '@/data/propertyRepository'
import { defaultFilters } from '@/shared/lib/propertyQuery'
import type { Property, PropertyFilters, PropertyType } from '@/types'
import type { Project, ProjectType } from '@/features/projects/types/projectTypes'

/**
 * Which listing types can sensibly be offered alongside a development.
 *
 * A commercial development paired with residential flats reads as though the
 * listings belong to the same scheme. Mapping by project type keeps the pairing
 * plausible, and an empty result is an acceptable outcome — the section is hidden
 * rather than padded with unrelated stock.
 */
const RELATED_TYPES: Record<ProjectType, PropertyType[]> = {
  residential: ['apartment', 'house'],
  'luxury-apartments': ['luxury', 'apartment'],
  estate: ['house', 'development', 'land'],
  commercial: ['commercial'],
  'mixed-use': ['commercial', 'apartment', 'development'],
}

interface RelatedPropertiesRequest {
  project: Project
  limit?: number
}

interface RelatedPropertiesResult {
  properties: Property[]
  isLoading: boolean
}

/**
 * Listings in the same location, for the "You may also like" panel.
 *
 * Reuses the properties repository rather than reaching for the mock array, so
 * when `fetchProperties` becomes `GET /api/properties` this hook keeps working
 * unchanged.
 *
 * ⚠️ Association is by location and type only. The demo data has no link between
 * a listing and a development, so nothing here claims a property is *part of* the
 * scheme — these are nearby homes and units, not units within the development.
 */
export function useRelatedProperties({ project, limit = 3 }: RelatedPropertiesRequest): RelatedPropertiesResult {
  const filters: PropertyFilters = {
    ...defaultFilters,
    purpose: 'any',
    location: [project.locationSlug],
    propertyType: RELATED_TYPES[project.projectType],
  }

  const queryKey = `${filters.location.join(',')}|${filters.propertyType.join(',')}|${limit}`

  // Seeded during render from the repository cache, the same way
  // `usePropertyListing` does it: if the visitor has already browsed listings, the
  // panel is populated on first paint instead of flashing empty then filling in.
  const [response, setResponse] = useState<{ key: string; items: Property[] } | null>(() => {
    const cached = readProperties({ filters, sort: 'newest', page: 1, perPage: limit })

    return cached ? { key: queryKey, items: cached.items.slice(0, limit) } : null
  })

  useEffect(() => {
    let isCancelled = false

    fetchProperties({ filters, sort: 'newest', page: 1, perPage: limit })
      .then((page: PropertyListingPage) => {
        if (isCancelled) return
        setResponse({ key: queryKey, items: page.items.slice(0, limit) })
      })
      .catch(() => {
        // Related listings are supplementary, so a failure hides the section
        // rather than showing an error in the middle of a development page.
        if (isCancelled) return
        setResponse({ key: queryKey, items: [] })
      })

    return () => {
      isCancelled = true
    }
    // `queryKey` encodes every input; depending on the objects themselves would
    // refetch on every render because `filters` is built fresh each pass.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey])

  return {
    properties: response?.items ?? [],
    isLoading: response === null,
  }
}
