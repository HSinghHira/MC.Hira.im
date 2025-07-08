import tailwindcss from "@tailwindcss/vite"
import type { UserConfig } from 'vite'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import llmstxt from 'vitepress-plugin-llms'

export const viteConfig: UserConfig = {
  plugins: [
    pagefindPlugin(),
    tailwindcss(),
    llmstxt()
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