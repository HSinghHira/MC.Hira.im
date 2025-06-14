import { defineConfig } from 'vitepress'
import { locales } from './config/locales'
import { head, transformHead } from './config/head'
import { viteConfig } from './config/vite'
import { buildEnd } from './config/sitemap'
import { generateSidebar } from './config/autosidebar'

export const textMappings: Record<string, string> = {
  'meteor': 'Meteor Client Addons',
  'meteorplus': 'Meteor+',
  'meteor-plus': 'Meteor+',
  // Add more custom mappings as needed
}

export default defineConfig({
  title: "All About Minecraft",
  description: "Minecraft Related Tutorial and Downloads",
  base: '/',
  
  locales,
  
  vite: viteConfig,
  
  head,
  transformHead,
  
  lastUpdated: true,
  buildEnd,
  
  themeConfig: {
    sidebar: {
      '/en/': generateSidebar('./en'),
      '/pb/': generateSidebar('./pb')
    }
  },
})