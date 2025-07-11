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

  // URLs to exclude from sitemap
  const excludedUrls = new Set([
    '/pb',
    '/pb/',
    '/index/',
    'README'
  ])

  const shouldExclude = (url: string) => {
    if (excludedUrls.has(url)) {
      return true
    }

    if (url.startsWith('/en/meteor/preview/') || url.startsWith('/en/meteor/preview')) {
      return true
    }

    if (url.startsWith('/en/download/') || url.startsWith('/en/download')) {
      return true
    }

    return false
  }

  pages.forEach((page) => {
    let url = page.url
      .replace(/^\/\.vitepress\/dist\//, '/')
      .replace(/\.html$/, '')
      .replace(/\/index$/, '')
      .replace(/^(?!\/)/, '/')
      .replace(/\/+/g, '/')

    if (url !== '/' && !url.includes('.')) {
      url += '/'
    }

    if (shouldExclude(url)) {
      return
    }

    if (url && url.length > 0) {
      sitemap.write(url)
    }
  })

  sitemap.end()

  await new Promise<void>((r) => writeStream.on('finish', () => r()))
}