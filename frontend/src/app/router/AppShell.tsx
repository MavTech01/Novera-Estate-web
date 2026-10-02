import { Outlet, useLocation, useNavigation } from 'react-router-dom'

import { RouteProgressBar } from '@/shared/components/feedback/RouteProgressBar'
import { Footer } from '@/shared/components/layout/Footer'
import { Navbar } from '@/shared/components/navigation/Navbar'
import { RouteFocus, RouteScrollReset } from './RouteEffects'
import { RouteTitle } from './RouteTitle'
import { useRoutePhase } from './useRoutePhase'

/**
 * The global shell: everything that surrounds a page on every URL.
 *
 * This is the router's root layout route, so it is mounted once and stays put
 * while the route below it changes. That placement is not cosmetic: the navbar
 * needs the current path to mark the active section, the progress bar needs to
 * know a navigation is in flight, and the scroll and focus resets need the
 * committed location — none of which exist outside the router.
 */
export function AppShell() {
  const { pathname } = useLocation()
  const navigation = useNavigation()

  // Refining a filter, sorting or paginating is a navigation the router has to
  // perform, but it keeps the same page on screen. The two are told apart by
  // whether the path is moving, and everything that implies "the visitor is
  // waiting for something" keys off that rather than off `navigation.state`:
  // a filter should never flash a page-load bar or announce itself as a pending
  // region.
  const isPageChange = navigation.state !== 'idle' && navigation.location.pathname !== pathname
  const phase = useRoutePhase(isPageChange)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-accent-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      <RouteTitle />
      <RouteScrollReset />
      <RouteFocus />

      {/* A wrapper rather than `<main>`: every page renders its own
          `<main id="main-content">` as its root, which is what the skip link
          targets, so a landmark here would duplicate both on every route.
          `aria-busy` announces that the region is mid-swap, so assistive tech is
          not handed the outgoing page while the incoming one loads. */}
      <div aria-busy={isPageChange}>
        <Outlet />
      </div>

      <Footer />

      <RouteProgressBar phase={phase} />
    </>
  )
}
