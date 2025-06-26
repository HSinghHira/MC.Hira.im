import tailwindcss from "@tailwindcss/vite"
import type { UserConfig } from 'vite'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'

export const viteConfig: UserConfig = {
  plugins: [
    tailwindcss(),
    pagefindPlugin()
  ],
  ssr: {
    noExternal: ['primevue']
  },
  assetsInclude: [
    '**/*.webp',
    '**/*.ico',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
    '**/*.svg',
    '**/*.avif',
    '**/*.tiff',
    '**/*.bmp'
  ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          return `assets/[name].[ext]`
        }
      }
    }
  }
}