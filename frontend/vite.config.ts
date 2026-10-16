import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

// Tailwind is wired through PostCSS (see postcss.config.ts) so the build is
// not sensitive to spaces or unusual characters in the project path.

/**
 * Source root as an absolute path.
 * `@`/`@/*` resolve to `src/`/`src/*` for imports and for the Vite watcher.
 */
const SOURCE_ROOT = fileURLToPath(new URL('./src', import.meta.url))

const THEME_PATH = fileURLToPath(new URL('./src/styles/theme.css', import.meta.url))
const BOOT_TOKEN_PLACEHOLDER = '<!-- boot-loader-tokens -->'

/**
 * The boot loader in index.html paints before the bundled stylesheet arrives,
 * so it cannot read theme.css at runtime. These map design tokens onto the
 * variables the inline block uses, keeping the palette in one place.
 */
const BOOT_TOKENS = [
  ['--boot-surface', '--color-canvas'],
  ['--boot-accent', '--color-accent-500'],
  ['--boot-accent-soft', '--color-accent-400'],
  ['--boot-track', '--color-sand-200'],
  ['--boot-on-accent', '--color-sand-50'],
] as const

function bootLoaderTokens(): Plugin {
  return {
    name: 'novera-boot-loader-tokens',

    transformIndexHtml: {
      // Prepend, so the bundled stylesheet still wins any cascade conflict.
      order: 'pre',

      handler(html) {
        if (!html.includes(BOOT_TOKEN_PLACEHOLDER)) {
          throw new Error(
            `vite: ${BOOT_TOKEN_PLACEHOLDER} is missing from index.html, so the boot loader would fall back to unstyled colours.`,
          )
        }

        const theme = readFileSync(THEME_PATH, 'utf8')
        const declarations = BOOT_TOKENS.map(([bootToken, themeToken]) => {
          const value = theme.match(new RegExp(`${themeToken}:\\s*(#[\\da-f]{3,8})`, 'i'))?.[1]
          if (!value) {
            throw new Error(
              `vite: ${themeToken} is missing from src/styles/theme.css, so the boot loader cannot be themed.`,
            )
          }
          return `    ${bootToken}: ${value};`
        })

        const block = [
          '/* Generated from src/styles/theme.css by novera-boot-loader-tokens.',
          '   Edit the tokens there — this block is rebuilt on every change. */',
          '#boot-loader {',
          ...declarations,
          '}',
          '',
          '#boot-loader .boot-mark svg rect {',
          '  fill: var(--boot-accent);',
          '}',
          '#boot-loader .boot-mark svg path {',
          '  stroke: var(--boot-on-accent);',
          '}',
        ].join('\n')

        return html.replace(BOOT_TOKEN_PLACEHOLDER, `<style>\n${block}\n    </style>`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), bootLoaderTokens()],
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
