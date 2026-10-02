import { AppRouter } from './app/router/AppRouter'
import { RouteProgressBar } from './shared/components/feedback/RouteProgressBar'
import { Footer } from './shared/components/layout/Footer'
import { Navbar } from './shared/components/navigation/Navbar'
import { useRouteTransition } from './shared/hooks/useRouteTransition'
import { useScrollRestoration } from './shared/hooks/useScrollRestoration'

/**
 * The global shell: everything that surrounds a page on every URL.
 *
 * Which page that is, and what it is called in the browser tab, is the
 * router's decision — `AppRouter` owns both. This component only supplies the
 * chrome that must stay put while routes change underneath it.
 */
export default function App() {
  const { phase, isPending } = useRouteTransition()
  // Settles the scroll position for the committed route, before paint.
  useScrollRestoration()

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-accent-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      {/* A wrapper rather than `<main>`: every page renders its own
          `<main id="main-content">` as its root, which is what the skip link
          targets, so a landmark here would duplicate both on every route.
          `aria-busy` announces that the region is mid-swap, so assistive tech is
          not handed the outgoing page while the incoming one loads. */}
      <div aria-busy={isPending}>
        <AppRouter />
      </div>

      <Footer />

      <RouteProgressBar phase={phase} />
    </>
  )
}
