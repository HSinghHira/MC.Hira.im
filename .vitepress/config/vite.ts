import tailwindcss from "@tailwindcss/vite"
import type { UserConfig } from 'vite'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import llmstxt from 'vitepress-plugin-llms'

import {
  GitChangelog,
  GitChangelogMarkdownSection
} from '@nolebase/vitepress-plugin-git-changelog/vite'

export const viteConfig: UserConfig = {
  plugins: [
    pagefindPlugin(),
    tailwindcss(),
    llmstxt(),
    GitChangelog({
      repoURL: () => 'https://github.com/HSinghHira/MC.Hira.im',
      maxGitLogCount: 1000,
    }),
    GitChangelogMarkdownSection({
      sections: {
        disableChangelog: false,
        disableContributors: false,
      },
      // exclude: (id) => {
      //   // Exclude index.md files in the meteor directory
      //   return id.endsWith('index.md') && id.includes('meteor/')
      // },
    }),
  ],
  optimizeDeps: {
    exclude: [
      '@nolebase/vitepress-plugin-git-changelog/client',
      '@nolebase/vitepress-plugin-enhanced-readabilities/client',
      '@nolebase/vitepress-plugin-inline-link-preview/client',
    ],
  },
  ssr: {
    noExternal: [
      'primevue',
      '@nolebase/vitepress-plugin-git-changelog',
      '@nolebase/ui',
      '@nolebase/vitepress-plugin-enhanced-readabilities',
      '@nolebase/vitepress-plugin-inline-link-preview',
    ],
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