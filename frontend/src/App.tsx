import { RouteProgressBar } from './shared/components/feedback/RouteProgressBar'
import { Footer } from './shared/components/layout/Footer'
import { Navbar } from './shared/components/navigation/Navbar'
import { useRouteTransition } from './shared/hooks/useRouteTransition'
import { useDocumentTitle } from './shared/hooks/useDocumentTitle'
import { matchRoute } from './shared/lib/router'
import { findRoute } from './shared/lib/routeManifest'
import { routePatterns, routes } from './shared/lib/routes'
import { AboutPage } from './pages/About/AboutPage'
import { HomePage } from './pages/HomePage'
import { LocationsPage } from './pages/Locations/LocationsPage'
import { RouteNoticePage } from './pages/RouteNoticePage'
import { PropertiesPage } from './pages/Properties/PropertiesPage'
import { PropertyDetailsPage } from './pages/Properties/PropertyDetailsPage'
import { ProjectsPage } from './pages/Projects/ProjectsPage'
import { ProjectDetailsPage } from './pages/Projects/ProjectDetailsPage'

const SITE_NAME = 'Novera Estates'

/** A route resolved to something renderable, plus the title it owns. */
interface ResolvedRoute {
  page: React.ReactNode
  /**
   * `null` means the page sets its own title — the detail page uses the
   * property's name, and a parent effect would otherwise overwrite it.
   */
  title: string | null
}

/**
 * Resolves the active route to a page.
 *
 * A path with no page yet (`/contact`, `/projects`, `/services/:slug`, …) gets a
 * notice named after that section rather than the homepage. Serving the
 * homepage there looked like a working page, which is how a visitor ends up
 * reading content that has nothing to do with the address they asked for — and
 * publishing the homepage's title and metadata at every unfinished URL.
 */
function resolveRoute(path: string): ResolvedRoute {
  const match = matchRoute(routePatterns, path)

  switch (match?.pattern) {
    case routes.home:
      return { page: <HomePage />, title: `${SITE_NAME} — Lagos Homes, Land & Investment Property` }
    case routes.properties:
      return { page: <PropertiesPage />, title: `Properties for Sale & Rent in Lagos — ${SITE_NAME}` }
    case routes.propertyDetail:
      return { page: <PropertyDetailsPage slug={match.params.slug} />, title: null }
    case routes.projects:
      return { page: <ProjectsPage />, title: `Developments in Lagos — ${SITE_NAME}` }
    case routes.projectDetail:
      // `title: null` — the page sets it from the development's name once loaded.
      return { page: <ProjectDetailsPage slug={match.params.slug} />, title: null }
    case routes.locations:
      return { page: <LocationsPage />, title: `Prime Locations in Lagos — ${SITE_NAME}` }
    case routes.about:
      return { page: <AboutPage />, title: `About Novera Estates — ${SITE_NAME}` }
    default: {
      const planned = findRoute(path)

      if (planned && planned.definition.status === 'planned') {
        return {
          page: (
            <RouteNoticePage
              variant="planned"
              title={planned.definition.title}
              description={planned.definition.description}
            />
          ),
          title: `${planned.definition.title} — ${SITE_NAME}`,
        }
      }

      return {
        page: <RouteNoticePage variant="missing" path={path} />,
        title: `Page Not Found — ${SITE_NAME}`,
      }
    }
  }
}

export default function App() {
  const { location, phase, isPending } = useRouteTransition()
  const { page, title } = resolveRoute(location.path)

  useDocumentTitle(title)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-accent-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      {/* `aria-busy` announces that this region is mid-swap, so assistive tech is
          not handed the outgoing page while the incoming one loads. */}
      <div aria-busy={isPending}>{page}</div>

      <Footer />

      <RouteProgressBar phase={phase} />
    </>
  )
}