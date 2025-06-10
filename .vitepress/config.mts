import { createContentLoader, defineConfig, HeadConfig } from 'vitepress'
import tailwindcss from "@tailwindcss/vite";
import { SitemapStream } from 'sitemap'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  title: "All About Minecraft", // still required
  description: "Minecraft Related Tutorial and Downloads",
  base: '/',
   locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Credits', link: '/en/pages/credits' },
          { text: 'Issues', link: 'https://github.com/HSinghHira/MC.Hira.im/issues' },
        ],
        sidebar: [
          {
            text: 'Tutorials',
            collapsed: true,
            items: [
              {
                text: 'How to Install Mods?',
                link: '/en/tutorials/how-to-install-mods/',
                items: [
                  { text: 'For Modrinth', link: '/en/tutorials/how-to-install-mods/install-mods-in-modrinth' }
                ]
              },
            ]
          },
          {
            text: 'Meteor Client Addons',
            collapsed: true,
            items: [
              { text: 'Electron', link: '/en/meteor/electron/' }
            ]
          }
        ],
        socialLinks: [
          { icon: 'discord', link: 'https://discord.gg/q5nF6mj4AV' }
        ],
        lastUpdated: {
          text: 'Updated at',
          formatOptions: {
            dateStyle: 'full',
            timeStyle: 'medium'
          }
        },
        footer: {
          message: 'Made with ❤️ in New Zealand',
          copyright: '2025 © Harman Singh Hira'
        }
        // Removed localeLinks - VitePress handles this automatically
      }
    },

    pb: {
      label: 'ਪੰਜਾਬੀ',
      lang: 'pa',
      link: '/pb/',
      themeConfig: {
        nav: [
          { text: 'ਘਰ', link: '/pb/' },
          { text: 'ਕ੍ਰੈਡਿਟਸ', link: '/pb/pages/credits' }, // Fixed link path
          { text: 'ਮੁੱਦੇ', link: 'https://github.com/HSinghHira/MC.Hira.im/issues' },
        ],
        sidebar: [
          {
            text: 'ਟਿਊਟੋਰਿਅਲ',
            collapsed: true,
            items: [
              {
                text: 'ਮੋਡ ਕਿਵੇਂ ਇੰਸਟਾਲ ਕਰੀਏ?',
                link: '/pb/tutorials/how-to-install-mods/', // Fixed link path
                items: [
                  { text: 'ਮੋਡਰਿਨਥ ਲਈ', link: '/pb/tutorials/how-to-install-mods/install-mods-in-modrinth' } // Fixed link path
                ]
              }
            ]
          },
          {
            text: 'ਮੀਟੀਅਰ ਐਡ-ਆਨਜ਼',
            collapsed: true,
            items: [
              { text: 'ਇਲੈਕਟ੍ਰਾਨ', link: '/pb/meteor/electron/' } // Fixed link path
            ]
          }
        ],
        socialLinks: [
          { icon: 'discord', link: 'https://discord.gg/q5nF6mj4AV' }
        ],
        lastUpdated: {
          text: 'ਅੱਪਡੇਟ ਕੀਤਾ ਗਿਆ',
          formatOptions: {
            dateStyle: 'full',
            timeStyle: 'medium'
          }
        },
        footer: {
          message: 'ਨਿਊਜ਼ੀਲੈਂਡ ਵਿੱਚ ਪਿਆਰ ਨਾਲ ਬਣਾਇਆ ਗਿਆ',
          copyright: '2025 © ਹਰਮਨ ਸਿੰਘ ਹੀਰਾ'
        }
        // Removed localeLinks - VitePress handles this automatically
      }
    }
  },

  vite: {
    plugins: [tailwindcss()],
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
  },

  head: [
    ['meta', { name: 'author', content: 'Harman Singh Hira' }],
    ['meta', { charset: 'UTF-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { name: 'keywords', content: 'Minecraft, mods, tutorials, Meteor Client, modding, gaming' }],
    
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'All About Minecraft' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: 'pa_IN' }],
    // ['meta', { property: 'og:image', content: 'https://mc.hira.im/data/icons/og-image.png' }],
    // ['meta', { property: 'og:image:width', content: '1200' }],
    // ['meta', { property: 'og:image:height', content: '630' }],
    // ['meta', { property: 'og:image:type', content: 'image/png' }],
    
    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@HSinghHira' }],
    ['meta', { name: 'twitter:creator', content: '@HSinghHira' }],
    // ['meta', { name: 'twitter:image', content: 'https://mc.hira.im/data/icons/og-image.png' }],
    
    // Links
    ['link', { rel: 'icon', href: '/data/icons/favicon.ico' }],
    // ['link', { rel: 'apple-touch-icon', href: '/data/icons/apple-touch-icon.png' }],
    // ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['link', { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }],
    ['link', { rel: 'robots', href: '/robots.txt' }],
    
    // Preconnect for performance
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'dns-prefetch', href: 'https://discord.gg' }],
    ['link', { rel: 'dns-prefetch', href: 'https://github.com' }]
  ],
  transformHead: ({ pageData }) => {
    const head: HeadConfig[] = []

    // Use fallback values if frontmatter properties are undefined
    const title = pageData.frontmatter.title || pageData.title || 'All About Minecraft'
    const description = pageData.frontmatter.description || pageData.description || 'Minecraft Related Tutorial and Downloads'
    const currentUrl = `https://mc.hira.im${pageData.relativePath.replace(/\.md$/, '.html').replace(/index\.html$/, '')}`
    const lastModified = pageData.lastUpdated ? new Date(pageData.lastUpdated).toISOString() : new Date().toISOString()

    // Canonical URL
    head.push(['link', { rel: 'canonical', href: currentUrl }])
    
    // Open Graph
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { property: 'og:url', content: currentUrl }])
    head.push(['meta', { property: 'og:updated_time', content: lastModified }])
    
    // Twitter Card
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])
    head.push(['meta', { name: 'twitter:url', content: currentUrl }])
    
    // SEO Meta
    head.push(['meta', { name: 'description', content: description }])
    
    // Last Modified
    head.push(['meta', { name: 'last-modified', content: lastModified }])
    head.push(['meta', { property: 'article:modified_time', content: lastModified }])
    
    // Language alternates for multilingual support
    if (pageData.relativePath.startsWith('en/')) {
      const pbPath = pageData.relativePath.replace('en/', 'pb/')
      head.push(['link', { rel: 'alternate', hreflang: 'pa', href: `https://mc.hira.im/${pbPath.replace(/\.md$/, '.html').replace(/index\.html$/, '')}` }])
      head.push(['link', { rel: 'alternate', hreflang: 'en', href: currentUrl }])
      head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: currentUrl }])
    } else if (pageData.relativePath.startsWith('pb/')) {
      const enPath = pageData.relativePath.replace('pb/', 'en/')
      head.push(['link', { rel: 'alternate', hreflang: 'en', href: `https://mc.hira.im/${enPath.replace(/\.md$/, '.html').replace(/index\.html$/, '')}` }])
      head.push(['link', { rel: 'alternate', hreflang: 'pa', href: currentUrl }])
      head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: `https://mc.hira.im/${enPath.replace(/\.md$/, '.html').replace(/index\.html$/, '')}` }])
    }
    
    return head
  },
  lastUpdated: true,
  buildEnd: async ({ outDir }) => {
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
});