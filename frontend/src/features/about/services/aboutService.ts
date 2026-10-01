import { aboutSeed } from '@/features/about/data/aboutData'
import type { AboutPageContent, AboutTeamMember } from '@/features/about/types/aboutTypes'

/**
 * About page data source.
 *
 * This module is the single seam between the About UI and where its content
 * comes from. It already speaks the shape `GET /api/about` will expose, so
 * replacing the body below with a `fetch('/api/about')` requires no change to
 * any component, hook or page above it.
 *
 * The About page is one record rather than a list, so there is no query
 * vocabulary here — the endpoint takes no parameters and returns the whole page.
 * Responses are cached for the same reason the properties repository and the
 * other feature services cache: `routeManifest` awaits a preload before the
 * route commits, so the page's hook finds its data already in memory and paints
 * real content on the first frame instead of flashing a skeleton.
 */

/** Simulated round-trip so the loading state is exercised realistically. */
const MOCK_LATENCY_MS = 120

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

/** Resolved responses only. Never holds a promise — see `fetchOnce`. */
const responseCache = new Map<string, unknown>()

/** Requests still in flight, so concurrent callers share one call. */
const pendingRequests = new Map<string, Promise<unknown>>()

const ABOUT_QUERY_KEY = 'about:content'

function readCache<T>(key: string): T | undefined {
  return responseCache.get(key) as T | undefined
}

/**
 * Cached value or a fresh load, whichever comes first.
 *
 * Two maps, because the two jobs conflict. `pendingRequests` deduplicates a
 * route preload racing the page's own hook, while `responseCache` holds the
 * settled value so a remount reads it synchronously and skips its skeleton.
 */
function fetchOnce<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (responseCache.has(key)) return Promise.resolve(responseCache.get(key) as T)

  const pending = pendingRequests.get(key) as Promise<T> | undefined
  if (pending) return pending

  const request = load()
    .then((value) => {
      responseCache.set(key, value)
      return value
    })
    .finally(() => {
      pendingRequests.delete(key)
    })

  pendingRequests.set(key, request)

  return request
}

/**
 * Guards the demo-data flags the UI relies on.
 *
 * `isDemo` and `isPlaceholder` drive the notices that stop placeholder copy
 * reading as fact, so they are normalised here rather than trusted from the
 * payload. The moment the real API is wired up this stops mattering — the
 * server sets the flags from actual records — but until then it means a
 * hand-edited data file cannot accidentally drop a disclosure by omission.
 */
function resolveTeam(members: readonly AboutTeamMember[]): AboutTeamMember[] {
  return members.map((member) => ({ ...member, isDemo: true }))
}

/**
 * The whole About page.
 *
 * Mirrors `GET /api/about`.
 */
export function getAboutContent(): Promise<AboutPageContent> {
  return fetchOnce(ABOUT_QUERY_KEY, async () => {
    await delay(MOCK_LATENCY_MS)

    return {
      ...aboutSeed,
      team: resolveTeam(aboutSeed.team),
      // A notice is only worth rendering if it has something to say — a story
      // with real milestones no longer needs its placeholder disclosure, and an
      // empty box would say so more loudly than the copy it replaced.
      notices: aboutSeed.notices.filter((notice) => notice.message.trim().length > 0),
    }
  })
}

/** Cached page content, or `undefined`. Read during render by the hook. */
export function readAboutContent(): AboutPageContent | undefined {
  return readCache<AboutPageContent>(ABOUT_QUERY_KEY)
}

/**
 * Warms the About content cache so the page paints on its first frame.
 *
 * Called by `routeManifest` before `/about` commits. Nothing about the hero
 * needs a second pass once this resolves, which is why there is no image decode
 * here — the hero photograph is preloaded in `index.html` alongside the other
 * above-the-fold assets.
 */
export function preloadAboutContent(): Promise<AboutPageContent> {
  return getAboutContent()
}