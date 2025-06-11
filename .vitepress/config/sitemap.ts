import { createContentLoader } from 'vitepress'
import { SitemapStream } from 'sitemap'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'

export const buildEnd = async ({ outDir }: { outDir: string }) => {
  const sitemap = new SitemapStream({ hostname: 'https://mc.hira.im' })
  
  // Load all markdown files from all directories, excluding README files
  const pages = await createContentLoader([
    '**/*.md',
    '!**/README.md',
    '!README.md'
  ]).load()
  
  const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))

  sitemap.pipe(writeStream)
  
  pages.forEach((page) => {
    const url = page.url
      // Strip `index.html` from URL
      .replace(/index\.html$/g, '')
      // Remove any leading slashes and ensure proper formatting
      .replace(/^\/+/, '/')
    
    // Only add valid URLs (skip empty or invalid ones)
    if (url && url !== '/') {
      sitemap.write(url)
    }
  })
  
  // Add root URLs manually for each locale
  sitemap.write('/en/')
  sitemap.write('/pb/')
  
  sitemap.end()

  await new Promise<void>((r) => writeStream.on('finish', () => r()))
}