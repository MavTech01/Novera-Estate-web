/**
 * Stops the browser restoring the scroll position on back/forward.
 * Hands position handling to the router.
 */
export function takeOverScrollRestoration(): void {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
}
