import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { takeOverScrollRestoration } from './app/router/scrollRestoration'
import './styles/index.css'

const container = document.getElementById('root')

if (!container) throw new Error('Root element #root was not found in index.html')

takeOverScrollRestoration()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
