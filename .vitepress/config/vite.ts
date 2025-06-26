import tailwindcss from "@tailwindcss/vite"
import { pagefind } from "vitepress-plugin-pagefind"
import type { UserConfig } from 'vite'

export const viteConfig: UserConfig = {
  plugins: [
    tailwindcss(),
    pagefind()
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