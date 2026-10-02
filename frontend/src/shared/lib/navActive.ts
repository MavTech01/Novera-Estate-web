import { normalisePath, splitHref } from './href'
import type { NavigationEntry } from '@/types'

/**
 * Active-state rules for the site's navigation.
 *
 * These survive the move to React Router deliberately. `NavLink` decides what is
 * active for a single link, and it does not know about the *other* links in the
 * menu — so it cannot express the rule that "Properties" and "Rent" are siblings
 * competing for the same section, and that only one of them may light up. The
 * navigation is data-driven and query-aware, so it is tested here instead.
 */

/**
 * Whether a link's path is the current path, or an ancestor of it.
 *
 * Section entries must stay highlighted while you are inside a section — being on
 * `/properties/novera-estate` or `/projects/orogies-rise` does not make "Projects"
 * an inactive link, it makes it the section you are in.
 *
 * The match is segment-wise, so `/projects` never claims `/projects-archive`, and
 * the site root is excluded outright: it is the ancestor of every URL, and
 * treating it as active would light up "Home" on every page.
 */
function isPathOrAncestor(linkPath: string, path: string): boolean {
  const link = normalisePath(linkPath)
  const target = normalisePath(path)

  if (link === '/') return false
  if (link === target) return true

  return target.startsWith(`${link}/`)
}

/**
 * Active-state test for navigation links.
 *
 * `/properties` is active on every listing view *and* on a property detail page,
 * `/properties?purpose=rent` only when that query is present, and in-page anchors
 * (`/#about`) never claim the active state.
 *
 * Query matching is still exact. A refined entry like `/properties?purpose=rent`
 * must not light up on an unrelated detail page, so parent matching only applies
 * to unrefined links — the ones carrying no `?`.
 */
export function isHrefActive(href: string, path: string, query: URLSearchParams): boolean {
  const { path: linkPath, search, hash } = splitHref(href)

  if (hash) return false

  const isExact = normalisePath(linkPath) === normalisePath(path)
  const isUnrefined = search === ''

  if (!isExact && !(isUnrefined && isPathOrAncestor(linkPath, path))) return false

  for (const [key, value] of new URLSearchParams(search)) {
    if (query.get(key) !== value) return false
  }

  return true
}

/**
 * Every href reachable from the navigation, dropdown items included.
 *
 * Active-state matching needs the whole set at once: a plain entry such as
 * `/properties` steps aside for a refined sibling such as
 * `/properties?purpose=rent` when that sibling is the one being viewed, and that
 * comparison cannot be made inside a single link.
 */
export function collectNavigationHrefs(entries: readonly NavigationEntry[]): string[] {
  const hrefs: string[] = []

  for (const entry of entries) {
    if ('items' in entry) {
      if (entry.href) hrefs.push(entry.href)
      for (const item of entry.items) hrefs.push(item.href)
    } else {
      hrefs.push(entry.href)
    }
  }

  return hrefs
}

/**
 * Active test for a single link.
 *
 * A refined link (one carrying a query) is active on its own terms. A plain link
 * is active only when no refined sibling on the same path is active — otherwise
 * "Properties" and "Rent" would both light up on `/properties?purpose=rent`.
 * In-page anchors (`/#insights`) never take the active state.
 */
export function isNavigationLinkActive(
  href: string,
  allHrefs: readonly string[],
  path: string,
  query: URLSearchParams,
): boolean {
  if (!isHrefActive(href, path, query)) return false

  const { search } = splitHref(href)
  if (search !== '') return true

  const linkPath = normalisePath(splitHref(href).path)

  return !allHrefs.some((other) => {
    if (other === href) return false
    const sibling = splitHref(other)
    return sibling.search !== '' && normalisePath(sibling.path) === linkPath && isHrefActive(other, path, query)
  })
}

/** Active test for a top-level row: true when the row or any of its items match. */
export function isNavigationEntryActive(
  entry: NavigationEntry,
  allHrefs: readonly string[],
  path: string,
  query: URLSearchParams,
): boolean {
  if ('items' in entry) {
    if (entry.href && isNavigationLinkActive(entry.href, allHrefs, path, query)) return true
    return entry.items.some((item) => isNavigationLinkActive(item.href, allHrefs, path, query))
  }

  return isNavigationLinkActive(entry.href, allHrefs, path, query)
}
