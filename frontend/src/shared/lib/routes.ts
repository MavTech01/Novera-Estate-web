/**
 * Route table.
 *
 * Path patterns live here (and only here) so `App.tsx` can resolve the current
 * URL and components can build hrefs without hard-coding paths. Later, when
 * React Router is introduced, these become the `createBrowserRouter` routes.
 */
export const routes = {
  home: '/',
  properties: '/properties',
  propertyDetail: '/properties/:slug',
  /** Landing page for buying — a guided entry point into the filtered catalogue. */
  buy: '/buy',
  projects: '/projects',
  projectDetail: '/projects/:slug',
  locations: '/locations',
  locationDetail: '/locations/:slug',
  about: '/about',
  services: '/services/:slug',
  bookInspection: '/book-inspection',
  contact: '/contact',
} as const

/**
 * Patterns tried in order when resolving the active route.
 *
 * The list patterns are harmless on their own, but ordering them before their
 * detail patterns keeps `matchRoute` unambiguous and the table readable as
 * "the pages that exist, shallowest first".
 */
export const routePatterns: readonly string[] = [
  routes.home,
  routes.properties,
  routes.propertyDetail,
  routes.buy,
  routes.projects,
  routes.projectDetail,
  routes.locations,
  routes.locationDetail,
  routes.about,
]

export function propertyPath(slug: string): string {
  return `/properties/${slug}`
}

/** Project detail URL, e.g. `/projects/novera-heights`. */
export function projectPath(slug: string): string {
  return `${routes.projects}/${slug}`
}

/** Location detail URL, e.g. `/locations/lekki`. */
export function locationPath(slug: string): string {
  return `${routes.locations}/${slug}`
}

/**
 * The properties catalogue filtered to a location.
 *
 * Takes the *property* location slugs rather than a location slug: a city-level
 * area such as Lekki is split across several catalogue slugs (`lekki-phase-1`,
 * `gupe`, `chevron`, …), and the properties facet already accepts a repeated
 * `location` parameter. The mapping from area to those slugs belongs to the
 * Locations feature, so this helper stays a plain URL builder and the filtering
 * itself is never reimplemented here.
 */
export function propertiesPathForLocation(propertyLocationSlugs: readonly string[]): string {
  const params = new URLSearchParams()
  for (const slug of propertyLocationSlugs) params.append('location', slug)

  return `${routes.properties}?${params.toString()}`
}

/** Single-catalogue-slug form of the link above. */
export function propertiesPathForLocationSlug(slug: string): string {
  return propertiesPathForLocation([slug])
}
