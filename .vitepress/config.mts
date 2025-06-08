import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";

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
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://mc.hira.im/' }],
    ['meta', { property: 'og:image', content: '' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://mc.hira.im/' }],
    ['link', { rel: 'icon', href: '/data/icons/favicon.ico' }]
  ]
});