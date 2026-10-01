import { PROPERTIES_PER_PAGE } from '@/data/propertyFilters'
import { preloadProperties, preloadPropertyBySlug } from '@/data/propertyRepository'
import { preloadAboutContent } from '@/features/about/services/aboutService'
import {
  preloadAllLocations,
  preloadFeaturedLocation,
  preloadLocations,
} from '@/features/locations/services/locationService'
import { parseLocationFilters } from '@/features/locations/utils/locationUtils'
import {
  preloadProjectBySlug,
  preloadProjects,
} from '@/features/projects/services/projectService'
import { buildProjectGallery } from '@/features/projects/utils/projectGallery'
import { parseProjectFilters } from '@/features/projects/utils/projectUtils'
import type { ParsedLocation } from './location'
import { parseFilters, parsePage, parseSort } from './propertyQuery'
import { matchPath, normalisePath } from './router'
import { routes } from './routes'

/**
 * Route table.
 *
 * Each entry declares the data its page needs *before* that page is allowed on
 * screen. The transition layer awaits `load`, so by the time a route commits,
 * the page's own hook finds its data already in the repository cache and paints
 * real content on the first frame — no skeleton between pages.
 *
 * `status` distinguishes a page that exists from a section that is in the
 * navigation but has no page yet. Rendering the homepage at those URLs was
 * wrong twice over: the content did not match the address, and the page
 * shipped the homepage's title and metadata.
 *
 * When React Router arrives this table becomes `createBrowserRouter`'s route
 * array, with each `load` becoming the route `loader`.
 */

export type RouteStatus = 'ready' | 'planned'

export interface RouteDefinition {
  pattern: string
  status: RouteStatus
  /** Used for the document title and the "coming soon" heading. */
  title: string
  /** Short line shown under a planned route's heading. */
  description?: string
  /** Everything the route needs before it may be shown. */
  load: (location: ParsedLocation, params: Record<string, string>) => Promise<unknown>
}

const noLoad = async (): Promise<void> => {}

/** Resolves once an image has decoded, so a committed page never pops in. */
function decodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src
  })
}

function loadListing(location: ParsedLocation): Promise<unknown> {
  return preloadProperties({
    filters: parseFilters(location.query),
    sort: parseSort(location.query),
    page: parsePage(location.query),
    perPage: PROPERTIES_PER_PAGE,
  })
}

function loadPropertyDetail(_location: ParsedLocation, params: Record<string, string>): Promise<unknown> {
  return preloadPropertyBySlug(params.slug).then(async (property) => {
    // Only the hero matters: it is what the visitor is looking at first.
    const hero = property?.gallery[0]?.src ?? property?.images[0]?.src
    if (hero) await decodeImage(hero)
  })
}

/**
 * Preloads the projects listing for whatever the URL already asks for.
 *
 * Parsing the query here is deliberate: `/projects?location=lekki-phase-1` is a
 * shareable, filtered URL, so the preload has to warm that same filter set
 * rather than the unfiltered catalogue the grid would otherwise request.
 */
function loadProjectListing(location: ParsedLocation): Promise<unknown> {
  return preloadProjects(parseProjectFilters(location.query))
}

function loadProjectDetail(_location: ParsedLocation, params: Record<string, string>): Promise<unknown> {
  return preloadProjectBySlug(params.slug).then(async (project) => {
    // Same reasoning as the property loader: only the hero is above the fold.
    if (!project) return

    const [hero] = buildProjectGallery(project)
    if (hero) await decodeImage(hero.src)
  })
}

/**
 * Preloads the locations catalogue for whatever the URL already asks for.
 *
 * `/locations?q=lekki&category=island` is a shareable, filtered URL, so the
 * preload warms that exact filter set — otherwise a deep link would commit
 * against an empty cache and paint skeletons the visitor had already asked to
 * avoid. Mirrors `loadProjectListing`.
 *
 * The full catalogue and the featured area are warmed alongside it: both render
 * above the fold on an unfiltered load, so leaving either cold would still show
 * a skeleton above already-painted results.
 */
function loadLocationListing(location: ParsedLocation): Promise<unknown> {
  return Promise.all([
    preloadLocations(parseLocationFilters(location.query)),
    preloadAllLocations(),
    preloadFeaturedLocation(),
  ])
}

/**
 * Preloads everything the About page paints.
 *
 * Two sources, because the page reads two features: its own content from the
 * About service, and the areas it links to from the Locations catalogue. The
 * locations catalogue is warmed alongside rather than on its own hook because
 * `LocationsPreview` is the first thing below the fold that needs it — warming
 * it later would show the placeholder box under an otherwise complete page.
 */
function loadAboutPage(): Promise<unknown> {
  return Promise.all([preloadAboutContent(), preloadAllLocations()])
}

export const routeManifest: readonly RouteDefinition[] = [
  {
    pattern: routes.home,
    status: 'ready',
    title: 'Novera Estates — Lagos Homes, Land & Investment Property',
    // The homepage is assembled from local data and its hero is preloaded in
    // index.html, so it is ready the moment the bundle runs. `noLoad` is also
    // what tells index.html to skip the preloader on a first visit here.
    load: noLoad,
  },
  {
    pattern: routes.properties,
    status: 'ready',
    title: 'Properties for Sale & Rent in Lagos — Novera Estates',
    load: loadListing,
  },
  {
    pattern: routes.propertyDetail,
    status: 'ready',
    title: 'Property Details — Novera Estates',
    load: loadPropertyDetail,
  },
  {
    pattern: routes.projects,
    status: 'ready',
    title: 'Lagos Developments & Estates — Novera Estates',
    load: loadProjectListing,
  },
  {
    pattern: routes.projectDetail,
    status: 'ready',
    // The page owns this title: it replaces it with the development's name once
    // the record resolves, which `App` signals by resolving this route to a
    // `null` title.
    title: 'Project Details — Novera Estates',
    load: loadProjectDetail,
  },
  {
    pattern: routes.locations,
    status: 'ready',
    title: 'Prime Locations in Lagos — Novera Estates',
    load: loadLocationListing,
  },
  {
    pattern: routes.locationDetail,
    status: 'planned',
    title: 'Location',
    description:
      'Full area guides — accessibility, schools, healthcare, amenities and every development we hold in each part of Lagos — are on the way.',
    load: noLoad,
  },
  {
    pattern: routes.about,
    status: 'ready',
    title: 'About Novera Estates — Novera Estates',
    load: loadAboutPage,
  },
  {
    pattern: routes.services,
    status: 'planned',
    title: 'Services',
    description:
      'Sales, rentals, land and investment advisory are all handled in person. Talk to an agent about what you are looking for.',
    load: noLoad,
  },
  {
    pattern: routes.contact,
    status: 'planned',
    title: 'Contact',
    description: 'Our office details and enquiry form are on the way. Reach us on any of the channels below.',
    load: noLoad,
  },
]

export interface RouteMatch {
  definition: RouteDefinition
  params: Record<string, string>
}

/** First matching entry wins, so more specific patterns come first. */
export function findRoute(path: string): RouteMatch | null {
  for (const definition of routeManifest) {
    const params = matchPath(definition.pattern, normalisePath(path))
    if (params) return { definition, params }
  }

  return null
}

/** Awaits whatever the destination needs. Rejections are the caller's problem. */
export function loadRoute(location: ParsedLocation): Promise<void> {
  const match = findRoute(location.path)
  if (!match) return Promise.resolve()

  return Promise.resolve(match.definition.load(location, match.params)).then(() => undefined)
}