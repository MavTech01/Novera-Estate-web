import { Footer } from './components/layout/Footer'
import { Navbar } from './components/navigation/Navbar'
import { usePathname } from './hooks/useRouter'
import { matchRoute } from './lib/router'
import { routePatterns, routes } from './lib/routes'
import { HomePage } from './pages/HomePage'
import { PropertiesPage } from './pages/Properties/PropertiesPage'
import { PropertyDetailsPage } from './pages/Properties/PropertyDetailsPage'

/**
 * Resolves the active route to a page.
 *
 * Paths that have no page yet (`/contact`, `/projects`, `/services/:slug`, …)
 * render the homepage rather than a blank screen, so the existing navigation and
 * footer links never dead-end while the site is being built out.
 */
function renderRoute(path: string) {
  const match = matchRoute(routePatterns, path)

  switch (match?.pattern) {
    case routes.home:
      return <HomePage />
    case routes.properties:
      return <PropertiesPage />
    case routes.propertyDetail:
      return <PropertyDetailsPage slug={match.params.slug} />
    default:
      return <HomePage />
  }
}

export default function App() {
  const path = usePathname()

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-accent-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      {renderRoute(path)}

      <Footer />
    </>
  )
}