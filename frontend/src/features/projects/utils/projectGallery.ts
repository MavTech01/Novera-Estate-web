import { featuredLocations } from '@/data/locations'
import type { ImageAsset } from '@/types'
import type { Project } from '@/features/projects/types/projectTypes'
import { fallbackLocationContent, projectLocationContent } from '@/features/projects/data/projectLocations'

/**
 * Assembles a project's display gallery.
 *
 * The catalogue's own `images` are the authoritative set, but a single photo
 * cannot exercise a gallery. Where a project has fewer than three images the
 * set is topped up from photography that already matches the record — the
 * neighbourhood photo and then the category photo for the scheme's type.
 *
 * Results are deduplicated by `src`, so the primary image is never repeated as
 * its own supporting shot.
 *
 * This is a display concern rather than data, which is why it lives in utils
 * instead of on the record: once the API returns a full `project_images` set,
 * `project.images` is used directly and this becomes unused.
 */

/** Falls back to the scheme's category shot when it has no own photography. */
const CATEGORY_IMAGE: Record<Project['projectType'], { src: string; alt: string }> = {
  residential: {
    src: '/images/categories/apartments.webp',
    alt: 'Residential apartment balconies photographed for Novera Estates',
  },
  'luxury-apartments': {
    src: '/images/categories/luxury.webp',
    alt: 'Finished luxury apartment interior photographed for Novera Estates',
  },
  estate: {
    src: '/images/categories/houses.webp',
    alt: 'Detached family homes photographed for Novera Estates',
  },
  commercial: {
    src: '/images/categories/commercial.webp',
    alt: 'Commercial office building photographed for Novera Estates',
  },
  'mixed-use': {
    src: '/images/categories/developments.webp',
    alt: 'Mixed-use development with landscaped grounds photographed for Novera Estates',
  },
}

function uniqueImages(sources: ImageAsset[]): ImageAsset[] {
  const seen = new Set<string>()

  return sources.filter((image) => {
    if (!image.src || seen.has(image.src)) return false
    seen.add(image.src)
    return true
  })
}

/**
 * The images for the gallery, primary first.
 *
 * Never returns an empty array: a project with no photography of its own still
 * gets the category image, so the detail page always has something to show.
 */
export function buildProjectGallery(
  project: Pick<Project, 'slug' | 'name' | 'location' | 'locationSlug' | 'projectType' | 'images'>,
): ImageAsset[] {
  const neighbourhood = featuredLocations.find((location) => location.slug === project.locationSlug)

  const supporting: ImageAsset[] = [
    ...project.images,
    ...(neighbourhood ? [neighbourhood.image] : []),
    CATEGORY_IMAGE[project.projectType],
  ]

  const gallery = uniqueImages(supporting)

  return gallery.length > 0 ? gallery : [CATEGORY_IMAGE[project.projectType]]
}

/**
 * The location record, address and surroundings for a project.
 *
 * Takes only what it needs rather than a whole `Project`, so `../data/projects`
 * can call it while decorating a record — at which point the record is not yet
 * a complete `Project`.
 */
export function buildProjectLocationInfo(project: { locationSlug: string; location: string }) {
  const content = projectLocationContent[project.locationSlug] ?? fallbackLocationContent

  return {
    address: content.address,
    /** Announced where the map placeholder stands in for an embedded map. */
    mapNote: `Map placeholder — ${project.location}`,
    nearby: content.nearby,
    accessibility: content.accessibility,
    highlights: content.highlights,
  }
}
