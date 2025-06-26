import tailwindcss from "@tailwindcss/vite"
import { SearchPlugin } from "vitepress-plugin-search"
import type { UserConfig } from 'vite'

export const viteConfig: UserConfig = {
  plugins: [
    tailwindcss(),
    SearchPlugin({
      previewLength: 62,
      buttonLabel: "Search",
      placeholder: "Search docs",
      allow: [],
      ignore: [],
    })
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