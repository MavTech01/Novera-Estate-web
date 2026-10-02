/**
 * URL string helpers.
 *
 * Deliberately framework-free: these operate on strings, not on a router, so the
 * design-system components that render a link can classify an `href` without
 * being inside React Router's context, and so the active-state tests below stay
 * plain functions.
 *
 * Matching is *not* here. React Router already owns path matching, param capture
 * and route selection; a second implementation here was the thing this module
 * used to do and no longer needs to.
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

/**
 * True for in-app links (`/properties`, `/#about`) and false for external URLs.
 *
 * The rule is "does this have a scheme or a host": `mailto:`, `tel:` and
 * `https://` must be left to the browser, while `/properties` and a bare
 * `?purpose=rent` are the router's business.
 */
export function isInternalHref(href: string): boolean {
  if (!href) return false
  // `//cdn.example.com/photo.jpg` is protocol-relative and therefore external.
  if (href.startsWith('//')) return false
  if (href.startsWith('#')) return true
  if (href.startsWith('/')) return true
  return !/^[a-z][a-z0-9+.-]*:/i.test(href)
}
