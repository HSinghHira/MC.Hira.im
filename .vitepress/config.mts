import { defineConfig } from 'vitepress'
import { locales } from './config/locales'
import { head, transformHead } from './config/head'
import { viteConfig } from './config/vite'
import { buildEnd } from './config/sitemap'
import { generateSidebar } from './config/autosidebar'
import { googleAnalyticsHead } from './config/tracking'

// Nolebase Git Changelog
import {
  GitChangelog,
  GitChangelogMarkdownSection
} from '@nolebase/vitepress-plugin-git-changelog/vite'

export const textMappings: Record<string, string> = {
  // Custom Text Mappings
  'meteor': 'Meteor Client Addons',
  'meteorplus': 'Meteor+',
  'meteor-plus': 'Meteor+',
  'mcping': 'MC Server Ping',
  'tools': 'Web-Based Online Tools',
  'meteor-archive': 'Meteor Client Archive',
}

// Define base directories for sidebar
export const baseDirs = ['tutorials', 'tools', 'useful-sites', 'meteor', 'meteor-archive']

// Define directories that use index.md with headings
export const headingBasedDirs = ['useful-sites', 'meteor-archive']

export default defineConfig({
  title: "All About Minecraft",
  description: "Minecraft Related Tutorial and Downloads",
  base: '/',
  locales,
  vite: {
    ...viteConfig,
    plugins: [
      // Spread existing plugins if they exist
      ...(Array.isArray(viteConfig?.plugins) ? viteConfig.plugins : []),
      GitChangelog({
        // Your actual repository URL
        repoURL: () => 'https://github.com/HSinghHira/MC.Hira.im',
        // Optional: Limit the number of commits to process
        maxGitLogCount: 1000,
      }),
      GitChangelogMarkdownSection({
        sections: {
          disableChangelog: false,
          disableContributors: false,
        },
        // Optional: Exclude certain files from showing changelog
        exclude: (id) => {
          // Example: exclude index files from showing detailed changelog
          return id.endsWith('index.md') && id.includes('meteor/')
        },
      }),
    ],
    // Add these configurations to fix the .vue file extension error
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-git-changelog/client',
        // Add other Nolebase plugins if you use them
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        '@nolebase/vitepress-plugin-inline-link-preview/client',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-git-changelog',
        '@nolebase/ui', // This is crucial for .vue file support
        // Add other Nolebase plugins if you use them
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/vitepress-plugin-inline-link-preview',
      ],
    },
  },
  head: [
    ...head,
    ...googleAnalyticsHead
  ],
  transformHead,
  ignoreDeadLinks: true,

  lastUpdated: true,
  buildEnd,

  themeConfig: {
    sidebar: {
      '/en/': generateSidebar('./en'),
      '/pb/': generateSidebar('./pb')
    }
  },
})