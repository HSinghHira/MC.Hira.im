import { defineConfig } from 'vitepress'
import tailwindcss from "@tailwindcss/vite"
import { locales } from './config/locales'
import { head, transformHead } from './config/head'
import { viteConfig } from './config/vite'
import { buildEnd } from './config/sitemap'

export default defineConfig({
  title: "All About Minecraft",
  description: "Minecraft Related Tutorial and Downloads",
  base: '/',
  
  locales,
  
  vite: viteConfig,
  
  head,
  transformHead,
  
  lastUpdated: true,
  buildEnd
})