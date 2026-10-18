import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigation } from 'react-router-dom'

import { RouteProgressBar } from '@/shared/components/feedback/RouteProgressBar'
import { Footer } from '@/shared/components/layout/Footer'
import { Navbar } from '@/shared/components/navigation/Navbar'
import { RouteFocus, RouteScrollReset } from './RouteEffects'
import { RouteTitle } from './RouteTitle'
import { useRoutePhase } from './useRoutePhase'

export function AppShell() {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const prevPathnameRef = useRef(pathname)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setIsNavigating(false)
      prevPathnameRef.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a')
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        const targetUrl = new URL(link.href)
        if (targetUrl.pathname !== pathname && !targetUrl.hash) {
          setIsNavigating(true)
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  const hasRouterNavigation = navigation.state !== 'idle' && navigation.location?.pathname !== pathname
  const isPageChange = hasRouterNavigation || isNavigating
  const phase = useRoutePhase(isPageChange)

  return (
    <>
      <RouteProgressBar phase={phase} />

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

      <Outlet />

      <Footer />
    </>
  )
}
