import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { whenBootReady } from './shared/lib/routeTransition'
import './styles/index.css'

const container = document.getElementById('root')

if (!container) throw new Error('Root element #root was not found in index.html')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/**
 * Dismisses the static preloader from index.html.
 *
 * Three things have to be true before the real page should be seen: the fonts
 * that set every measurement are loaded, the first route's data has arrived,
 * and one frame has been painted. Waiting for all three is what removes the
 * flash of unstyled or half-moved content — which, on a text-and-image site, is
 * the same flash the preloader was added to hide.
 *
 * The timeout is a safety net: a blocked webfont must never leave a visitor
 * staring at a loading screen.
 */
const BOOT_TIMEOUT_MS = 2500

function dismissBootLoader(): void {
  const loader = document.getElementById('boot-loader')
  if (!loader) return

  // Let the fade finish before removing the node.
  loader.setAttribute('data-done', 'true')
  window.setTimeout(() => loader.remove(), 350)
}

function fontsReady(): Promise<unknown> {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve()

  return document.fonts.ready
}

void Promise.race([
  // Resolves once the first route's data is in the repository cache.
  Promise.all([fontsReady(), whenBootReady()]),
  new Promise((resolve) => window.setTimeout(resolve, BOOT_TIMEOUT_MS)),
]).then(() => {
  // One more frame so React has certainly painted the committed page.
  window.requestAnimationFrame(() => window.requestAnimationFrame(dismissBootLoader))
})