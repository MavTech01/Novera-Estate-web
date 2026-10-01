import { isHrefActive, normalisePath, splitHref } from './router'
import type { NavigationEntry } from '@/types'

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
