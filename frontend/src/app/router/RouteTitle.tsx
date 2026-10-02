import { useMatches } from 'react-router-dom'

import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'

/** What each route declares about itself in its `handle`. */
interface RouteHandle {
  /** `null` means the page sets its own title — see `PropertyDetailsPage`. */
  title: string | null
}

/**
 * Applies the active route's document title.
 *
 * The title is declared alongside the route rather than inside the page, because
 * it is a property of the *address*: `/about` is called "About Novera Estates"
 * whether or not the page has finished loading. Reading it back from the router
 * also means the two detail pages can opt out with `title: null` and own the
 * title themselves, once they know the record's real name.
 */
export function RouteTitle() {
  const matches = useMatches()
  const handle = matches.at(-1)?.handle as RouteHandle | undefined

  useDocumentTitle(handle?.title ?? null)

  return null
}
