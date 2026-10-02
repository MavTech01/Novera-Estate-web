import { RouterProvider } from 'react-router-dom'

import { router } from './app/router/routes'

/**
 * The composition root.
 *
 * The application *is* its router: providers, the route table and the shell all
 * hang off it, and the shell has to live inside the router's context because the
 * navbar reads the current path and the progress bar reads the navigation state.
 * Mounting it here — rather than wrapping a hand-rolled resolver in a shell — is
 * what lets every one of those be the library's own hook instead.
 */
export default function App() {
  return <RouterProvider router={router} />
}
