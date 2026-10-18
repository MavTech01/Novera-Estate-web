import { PROPERTIES_PER_PAGE } from '@/data/propertyFilters'
import { preloadProperties, preloadPropertyBySlug } from '@/data/propertyRepository'
import { preloadAboutContent } from '@/features/about/services/aboutService'
import {
  BUY_FEATURED_LIMIT,
  BUY_HERO_IMAGE,
  preloadBuyCatalogue,
  preloadFeaturedBuyProperties,
} from '@/features/buy/services/buyService'
import {
  preloadAllLocations,
  preloadFeaturedLocation,
  preloadLocations,
} from '@/features/locations/services/locationService'
import { parseLocationFilters } from '@/features/locations/utils/locationUtils'
import { CONTACT_HERO_IMAGE } from '@/features/contact/data/contactData'
import {
  preloadProjectBySlug,
  preloadProjects,
} from '@/features/projects/services/projectService'
import {
  RENT_FEATURED_LIMIT,
  RENT_HERO_IMAGE,
  preloadFeaturedRentProperties,
  preloadRentCatalogue,
} from '@/features/rent/services/rentService'
import { buildProjectGallery } from '@/features/projects/utils/projectGallery'
import { parseProjectFilters } from '@/features/projects/utils/projectUtils'
import { parseFilters, parsePage, parseSort } from '@/shared/lib/propertyQuery'

/**
 * Route loaders.
 *
 * Each one declares the data its page needs *before* that page is allowed on
 * screen. React Router runs the destination's loader and keeps the outgoing page
 * on screen until it settles, so by the time the new route commits, the page's own
 * hook finds its data already in the repository cache and paints real content on
 * the first frame — no skeleton between pages.
 *
 * These are deliberately the same functions that used to live in a custom route
 * manifest: the preloading behaviour is deliberate and worth keeping, only the
 * routing engine around it changed.
 *
 * Loaders never throw. A failed preload is not worth replacing the page with an
 * error screen — the page renders its own error state, which is far more useful
 * than a loader that rejects.
 */

/** Matches the shape React Router passes to every loader. */
interface LoaderArgs {
  params: Record<string | number, string | undefined>
  request: Request
}

const noLoad = async (): Promise<void> => {}

/** Resolves once an image has decoded, so a committed page never pops in. */
function decodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    let resolved = false
    const done = () => {
      if (!resolved) {
        resolved = true
        resolve()
      }
    }
    const timer = setTimeout(done, 350)
    const image = new Image()
    image.onload = () => {
      clearTimeout(timer)
      done()
    }
    image.onerror = () => {
      clearTimeout(timer)
      done()
    }
    image.src = src
  })
}

function searchOf({ request }: LoaderArgs): URLSearchParams {
  return new URL(request.url).searchParams
}

function loadListing(args: LoaderArgs): Promise<unknown> {
  const query = searchOf(args)
  return preloadProperties({
    filters: parseFilters(query),
    sort: parseSort(query),
    page: parsePage(query),
    perPage: PROPERTIES_PER_PAGE,
  })
}

function loadPropertyDetail(args: LoaderArgs): Promise<unknown> {
  return preloadPropertyBySlug(String(args.params.slug)).then(async (property) => {
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
function loadProjectListing(args: LoaderArgs): Promise<unknown> {
  return preloadProjects(parseProjectFilters(searchOf(args)))
}

function loadProjectDetail(args: LoaderArgs): Promise<unknown> {
  return preloadProjectBySlug(String(args.params.slug)).then(async (project) => {
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
 * above the fold on an unfiltered load, so leaving either cold would still show a
 * skeleton above already-painted results.
 */
function loadLocationListing(args: LoaderArgs): Promise<unknown> {
  return Promise.all([
    preloadLocations(parseLocationFilters(searchOf(args))),
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
 * `LocationsPreview` is the first thing below the fold that needs it — warming it
 * later would show the placeholder box under an otherwise complete page.
 */
function loadAboutPage(): Promise<unknown> {
  return Promise.all([preloadAboutContent(), preloadAllLocations()])
}

/**
 * Preloads the Buy page.
 *
 * Both sources are needed for the first frame, and neither can wait for the
 * other's hook: the category cards and the "Popular Buying Locations" grid come
 * from one catalogue request, while the featured grid and the hero's own sections
 * read the listings. `preloadBuyPage` also decodes the hero photograph for the
 * same reason `loadPropertyDetail` does — it is what the visitor looks at first.
 */
function loadBuyPage(): Promise<unknown> {
  return Promise.all([preloadBuyCatalogue(), preloadFeaturedBuyProperties(BUY_FEATURED_LIMIT)]).then(
    async () => decodeImage(BUY_HERO_IMAGE.src),
  )
}

/**
 * Preloads the Rent page.
 *
 * Same reasoning as `loadBuyPage`: the category and location cards come from one
 * catalogue request while the featured grid reads the listings, so neither can
 * wait for the other, and the hero photograph is decoded before the route
 * commits.
 */
function loadRentPage(): Promise<unknown> {
  return Promise.all([preloadRentCatalogue(), preloadFeaturedRentProperties(RENT_FEATURED_LIMIT)]).then(
    async () => decodeImage(RENT_HERO_IMAGE.src),
  )
}

/**
 * Preloads the Contact page.
 *
 * All of the page's content is local — the office details from `company`, the FAQ
 * and the quick actions from the Contact feature — so the only thing worth
 * warming is the hero photograph, which is the first thing the visitor sees.
 */
function loadContactPage(): Promise<unknown> {
  return decodeImage(CONTACT_HERO_IMAGE.src)
}

export const loaders = {
  none: noLoad,
  listing: loadListing,
  propertyDetail: loadPropertyDetail,
  projectListing: loadProjectListing,
  projectDetail: loadProjectDetail,
  locationListing: loadLocationListing,
  about: loadAboutPage,
  buy: loadBuyPage,
  rent: loadRentPage,
  contact: loadContactPage,
  /** The FAQ page is a static list, so it needs nothing but its hero-free shell. */
  faq: noLoad,
} as const

/** The arguments React Router passes to a route's `shouldRevalidate`. */
interface RevalidateArgs {
  currentUrl: URL
  nextUrl: URL
}

/**
 * Re-runs a route's loader only when a *different page* is being visited.
 *
 * This is what keeps a filter change feeling instant. Refining a filter, sorting
 * or paging is a navigation the router performs, and left to itself it would
 * re-run the loader on every keystroke — re-warming data the page's own hook is
 * already reading from the repository cache, while the visitor waits.
 *
 * Letting the page hooks do that work is not a shortcut. They already derive
 * their state from the query and fetch through the same repository, so the
 * results are identical; the loader's job is warming data *before* a page is
 * first shown, and a query tweak on an already-rendered page is not that.
 *
 * The path comparison is the whole test. A change of path means a new page and a
 * genuine chance of a cold cache, so it revalidates — including on the first
 * load, which is why a shared `/properties?location=lekki` link still arrives
 * pre-warmed.
 */
export function revalidateOnPathChange({ currentUrl, nextUrl }: RevalidateArgs): boolean {
  return currentUrl.pathname !== nextUrl.pathname
}
