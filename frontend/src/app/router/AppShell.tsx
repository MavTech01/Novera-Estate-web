import { Outlet, useLocation, useNavigation } from 'react-router-dom'

import { Footer } from '@/shared/components/layout/Footer'
import { Navbar } from '@/shared/components/navigation/Navbar'
import { RouteFocus, RouteScrollReset } from './RouteEffects'
import { RouteTitle } from './RouteTitle'
import { useRouteProgress } from './useRouteProgress'

/**
 * The global shell: the navbar, footer and route effects that surround a page.
 *
 * It is the router's root layout route, so it stays mounted while the page below
 * it changes. That is why the progress bar is here: only a route can see when a
 * navigation is in flight.
 */
export function AppShell() {
  const { pathname } = useLocation()
  const navigation = useNavigation()

  // A real page change moves the path. Filtering, sorting or paging keeps the
  // same page, so it must not flash the loading bar.
  const isPageChange = navigation.state !== 'idle' && navigation.location.pathname !== pathname

  useRouteProgress(isPageChange)

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

      {/* `aria-busy` tells assistive tech the region is mid-swap, so it is not
          handed the outgoing page while the incoming one loads. */}
      <div aria-busy={isPageChange}>
        <Outlet />
      </div>

      <Footer />

      <span role="status" aria-live="polite" className="sr-only">
        {isPageChange ? 'Loading page' : ''}
      </span>
    </>
  )
}
