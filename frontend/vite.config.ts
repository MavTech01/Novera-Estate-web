import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Tailwind is wired through PostCSS (see postcss.config.ts) so the build is
// not sensitive to spaces or unusual characters in the project path.

/**
 * Source root as an absolute path.
 * `@`/`@/*` resolve to `src/`/`src/*` for imports and for the Vite watcher.
 */
const SOURCE_ROOT = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': SOURCE_ROOT,
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
        },
      },
    },
  },
})
