import { defineConfig } from 'vitepress';
import { locales } from './config/locales';
import { head, transformHead } from './config/head';
import { viteConfig } from './config/vite';
import { buildEnd } from './config/sitemap';
import { generateSidebar } from './config/autosidebar';
import { googleAnalyticsHead } from './config/tracking';

export const textMappings: Record<string, string> = {
  meteor: 'Meteor Client Addons',
  meteorplus: 'Meteor+',
  'meteor-plus': 'Meteor+',
  mcping: 'MC Server Ping',
  tools: 'Web-Based Online Tools',
  'meteor-archive': 'Meteor Client Archive',
};

export const baseDirs = ['tutorials', 'tools', 'useful-sites', 'meteor', 'meteor-archive'];
export const headingBasedDirs = ['useful-sites', 'meteor-archive'];

export default defineConfig({
  title: 'All About Minecraft',
  description: 'Minecraft Related Tutorial and Downloads',
  base: '/',
  srcDir: 'docs',
  outDir: 'docs/.vitepress/dist',
  locales,
  vite: viteConfig,
  head: [...head, ...googleAnalyticsHead],
  transformHead,
  ignoreDeadLinks: true,
  lastUpdated: true,
  buildEnd,
  themeConfig: {
    sidebar: {
      '/en/': generateSidebar('./en'),
      '/pb/': generateSidebar('./pb'),
    },
  },
});