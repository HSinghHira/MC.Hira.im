import type { HeadConfig, TransformContext } from 'vitepress'

export const head: HeadConfig[] = [
  ['meta', { name: 'author', content: 'Harman Singh Hira' }],
  ['meta', { charset: 'UTF-8' }],
  ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
  ['meta', { name: 'robots', content: 'index, follow' }],
  ['meta', { name: 'googlebot', content: 'index, follow' }],
  ['meta', { name: 'theme-color', content: '#10b981' }],
  ['meta', { name: 'keywords', content: 'Minecraft, mods, tutorials, Meteor Client, modding, gaming' }],

  ['meta', { name: 'google-site-verification', content: 'oQMdsS94GsVMXmnVVFsxY4syJf656ZWAXRu_g_fQIY8' }],


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
  ['meta', { name: 'twitter:domain', content: 'mc.hira.im' }],
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
  ['link', { rel: 'dns-prefetch', href: 'https://github.com' }],
  
  // Schema Markup
  ['script', { type: 'application/ld+json' }, `
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "All About Minecraft",
      "url": "https://mc.hira.im",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://mc.hira.im/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  `]
]

export const transformHead = ({ pageData }: TransformContext): HeadConfig[] => {
  const head: HeadConfig[] = []

  // Use fallback values if frontmatter properties are undefined
  const title = pageData.frontmatter.title || pageData.title || 'All About Minecraft'
  const description = pageData.frontmatter.description || pageData.description || 'Discover the latest Minecraft client addons, mods, and tools on MC.Hira.im. Stay updated with curated content, installation guides, and support for the Meteor Client.'
  
  // Handle keywords from frontmatter tags
  const defaultKeywords = 'Minecraft, mods, tutorials, Meteor Client, modding, gaming'
  let keywords = defaultKeywords
  
  // Debug: Log frontmatter to see what's available
  console.log('Frontmatter:', pageData.frontmatter)
  console.log('Tags value:', pageData.frontmatter.tags)
  
  if (pageData.frontmatter.tags) {
    // If tags is a string, use it directly
    if (typeof pageData.frontmatter.tags === 'string') {
      keywords = pageData.frontmatter.tags
      console.log('Using string tags:', keywords)
    }
    // If tags is an array, join with commas
    else if (Array.isArray(pageData.frontmatter.tags)) {
      keywords = pageData.frontmatter.tags.join(', ')
      console.log('Using array tags:', keywords)
    }
  } else {
    console.log('No tags found, using default keywords')
  }
  
  // Generate proper URL from relative path
  let urlPath = pageData.relativePath.replace(/\.md$/, '').replace(/\/index$/, '/')
  if (urlPath && !urlPath.startsWith('/')) {
    urlPath = '/' + urlPath
  }
  if (urlPath && !urlPath.endsWith('/') && !urlPath.includes('.')) {
    urlPath = urlPath + '/'
  }
  const currentUrl = `https://mc.hira.im${urlPath}`
  
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
  head.push(['meta', { name: 'keywords', content: keywords }])
  
  // Last Modified
  head.push(['meta', { name: 'last-modified', content: lastModified }])
  head.push(['meta', { property: 'article:modified_time', content: lastModified }])
  
  // Language alternates for multilingual support
  if (pageData.relativePath.startsWith('en/')) {
    const pbPath = pageData.relativePath.replace('en/', 'pb/')
    let pbUrlPath = pbPath.replace(/\.md$/, '').replace(/\/index$/, '/')
    if (pbUrlPath && !pbUrlPath.startsWith('/')) pbUrlPath = '/' + pbUrlPath
    if (pbUrlPath && !pbUrlPath.endsWith('/') && !pbUrlPath.includes('.')) pbUrlPath = pbUrlPath + '/'
    const pbUrl = `https://mc.hira.im${pbUrlPath}`
    
    head.push(['link', { rel: 'alternate', hreflang: 'pa', href: pbUrl }])
    head.push(['link', { rel: 'alternate', hreflang: 'en', href: currentUrl }])
    head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: currentUrl }])
  } else if (pageData.relativePath.startsWith('pb/')) {
    const enPath = pageData.relativePath.replace('pb/', 'en/')
    let enUrlPath = enPath.replace(/\.md$/, '').replace(/\/index$/, '/')
    if (enUrlPath && !enUrlPath.startsWith('/')) enUrlPath = '/' + enUrlPath
    if (enUrlPath && !enUrlPath.endsWith('/') && !enUrlPath.includes('.')) enUrlPath = enUrlPath + '/'
    const enUrl = `https://mc.hira.im${enUrlPath}`
    
    head.push(['link', { rel: 'alternate', hreflang: 'en', href: enUrl }])
    head.push(['link', { rel: 'alternate', hreflang: 'pa', href: currentUrl }])
    head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: enUrl }])
  }
  
  // Schema Markup for individual pages
  head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": currentUrl,
    "lastReviewed": lastModified
  })])

  return head
}