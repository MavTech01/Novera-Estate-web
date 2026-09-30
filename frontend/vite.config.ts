import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Tailwind is wired through PostCSS (see postcss.config.js) so the build is
// not sensitive to spaces or unusual characters in the project path.
export default defineConfig({
  plugins: [react()],
})
