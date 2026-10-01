/**
 * Tailwind runs through PostCSS rather than a Vite plugin so the build is not
 * sensitive to spaces or unusual characters in the project path.
 *
 * Typed with `satisfies` so a typo in the plugin name is a type error rather
 * than a silently unstyled build.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
} satisfies { plugins: Record<string, object> }