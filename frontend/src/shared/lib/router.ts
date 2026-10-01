/**
 * Dependency-free path helpers.
 *
 * The platform is a Vite SPA and the site navigation is built on plain
 * anchors, so a minimal history-based router is enough today. Keeping the
 * matching logic here means swapping in React Router later is a change to one
 * module — every `<Link />` and the route table in `App.tsx` stay untouched.
 */

/** Trailing slashes are meaningless for matching, so they are dropped. */
export function normalisePath(path: string): string {
  if (!path) return '/'
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
  return withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, '') : withLeadingSlash
}

/** Splits `/properties?type=house#x` into its three parts. */
export function splitHref(href: string): { path: string; search: string; hash: string } {
  const hashIndex = href.indexOf('#')
  const hash = hashIndex === -1 ? '' : href.slice(hashIndex)
  const withoutHash = hashIndex === -1 ? href : href.slice(0, hashIndex)

  const searchIndex = withoutHash.indexOf('?')
  const search = searchIndex === -1 ? '' : withoutHash.slice(searchIndex)
  const path = searchIndex === -1 ? withoutHash : withoutHash.slice(0, searchIndex)

  return { path, search, hash }
}

/** True for in-app links (`/properties`, `/#about`) and false for external URLs. */
export function isInternalHref(href: string): boolean {
  if (!href) return false
  // `//cdn.example.com/photo.jpg` is protocol-relative and therefore external.
  if (href.startsWith('//')) return false
  if (href.startsWith('#')) return true
  if (href.startsWith('/')) return true
  return !/^[a-z][a-z0-9+.-]*:/i.test(href)
}

/**
 * Matches a pattern such as `/properties/:slug` against a pathname.
 * Returns the captured params, or `null` when the pattern does not apply.
 */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternSegments = normalisePath(pattern).split('/').filter(Boolean)
  const pathSegments = normalisePath(pathname).split('/').filter(Boolean)

  if (patternSegments.length !== pathSegments.length) return null

  const params: Record<string, string> = {}

  for (const [index, patternSegment] of patternSegments.entries()) {
    const pathSegment = pathSegments[index]

    if (patternSegment.startsWith(':')) {
      params[patternSegment.slice(1)] = decodeURIComponent(pathSegment)
      continue
    }

    if (patternSegment !== pathSegment) return null
  }

  return params
}

/** Finds the first matching route in a table, e.g. `['/', '/properties', '/properties/:slug']`. */
export function matchRoute(
  patterns: readonly string[],
  pathname: string,
): { pattern: string; params: Record<string, string> } | null {
  for (const pattern of patterns) {
    const params = matchPath(pattern, pathname)
    if (params) return { pattern, params }
  }

  return null
}

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
