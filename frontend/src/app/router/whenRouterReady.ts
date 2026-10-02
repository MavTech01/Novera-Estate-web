import type { createBrowserRouter } from 'react-router-dom'

/**
 * The data router `createBrowserRouter` hands back.
 *
 * Named off the factory rather than imported: the underlying interface is
 * internal to the library and is called `Router` in the type docs, which is also
 * the name of the low-level routing *component*. Deriving it from the factory
 * keeps this pointing at the real thing without depending on either.
 */
type DataRouter = ReturnType<typeof createBrowserRouter>

/**
 * Stops the browser from restoring the scroll position on back/forward.
 *
 * This has to happen before the router is created, because the default
 * `history.scrollRestoration` of `'auto'` has the browser restoring the offset
 * for the entry being returned to as part of handling the traversal. That races
 * the router: the browser's restore is not synchronous, so the window can be
 * moved again after the router has already applied its own offset, and the
 * intermediate positions show up as scroll events the router then misreads as
 * the visitor moving around. `'manual'` hands the position back to the router,
 * which is the only thing that should be choosing it.
 */
export function takeOverScrollRestoration(): void {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}

/**
 * Resolves once the router has run its first loaders and is ready to render.
 *
 * The static preloader in index.html stands in for that window: it is dismissed
 * when the fonts that set every measurement have loaded, the first route's data
 * is in the cache, and one frame has been painted. Waiting for the router is what
 * replaces the old bespoke "boot load" promise.
 */
export function whenRouterReady(router: DataRouter): Promise<void> {
  return new Promise((resolve) => {
    if (router.state.initialized) {
      resolve()
      return
    }

    const unsubscribe = router.subscribe((state) => {
      if (!state.initialized) return
      unsubscribe()
      resolve()
    })
  })
}
