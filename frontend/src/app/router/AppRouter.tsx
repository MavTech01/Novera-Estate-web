import type { ReactNode } from 'react'

import { company } from '@/data/company'
import { RouteNoticePage } from '@/pages/RouteNoticePage'
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle'
import { useRouteTransition } from '@/shared/hooks/useRouteTransition'
import { findRoute } from '@/shared/lib/routeManifest'
import { getRouteEntry } from './routeConfig'

const SITE_NAME = company.name

/** A route resolved to something renderable, plus the title it owns. */
interface ResolvedRoute {
  page: ReactNode
  title: string | null
}

/**
 * Resolves the active path to a page, using the manifest as the route table.
 *
 * One matcher now covers every case: a ready pattern gets its registered page,
 * a `planned` pattern gets a notice named after that section, and anything the
 * manifest does not know gets a not-found notice. Serving the homepage at an
 * unfinished URL looked like a working page, which is how a visitor ends up
 * reading content that has nothing to do with the address they asked for — and
 * how the homepage's title got published at every address.
 */
function resolveRoute(path: string): ResolvedRoute {
  const match = findRoute(path)

  if (!match) {
    return {
      page: <RouteNoticePage variant="missing" path={path} />,
      title: `Page Not Found — ${SITE_NAME}`,
    }
  }

  const { definition, params } = match

  if (definition.status === 'planned') {
    return {
      page: (
        <RouteNoticePage variant="planned" title={definition.title} description={definition.description} />
      ),
      title: `${definition.title} — ${SITE_NAME}`,
    }
  }

  const entry = getRouteEntry(definition.pattern)

  // Unreachable while `routeConfig` covers every ready pattern, which the type
  // system enforces. A typo'd pattern degrades to "not found" rather than
  // rendering the wrong page for the address.
  if (!entry) {
    return {
      page: <RouteNoticePage variant="missing" path={path} />,
      title: `Page Not Found — ${SITE_NAME}`,
    }
  }

  return { page: entry.render(params), title: entry.title }
}

/**
 * Renders the page for the committed route and owns its document title.
 *
 * Deliberately stable across navigations: it is never keyed or unmounted, so the
 * title effect behaves exactly as it did when `App` owned it. The detail pages
 * rely on that — they replace the title with their record's name, and their
 * cleanup restores the previous one.
 */
export function AppRouter() {
  const { location } = useRouteTransition()
  const { page, title } = resolveRoute(location.path)

  useDocumentTitle(title)

  return <>{page}</>
}
