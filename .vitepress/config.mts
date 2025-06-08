import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['primevue'] // Ensure PrimeVue works with SSR
    }
  },
  title: "All About Minecraft",
  description: "Minecraft Related Tutorial and Downloads",
  base: '/',
  head: [
    // Basic Meta Tags
    ['meta', { name: 'author', content: 'Harman Singh Hira' }],
    ['meta', { charset: 'UTF-8' }],

    // Open Graph (Facebook, Discord)
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: '' }],
    ['meta', { property: 'og:image', content: '' }],

    // Twitter Cards
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: '' }],

    // Favicon (optional)
    ['link', { rel: 'icon', href: 'Assets/icons/Villager-Head.ico' }]
  ],
  themeConfig: {

    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Home', link: '/' },
      // { text: 'Home', link: '/' },
      // { text: 'Home', link: '/' },
      // { text: 'Home', link: '/' },
    ],

    sidebar: [
      
  
      {
        text: 'Villager Breeder',
        collapsed: true,
        items: [
          { text: 'Starter Villager Breeder', link: 'villager-breeder/starter-villager-breeder' },
          // { text: 'Item B', link: '/item-b' },

        ]
      },
      // {
      //   text: 'Section Title B',
      //   items: [
      //     { text: 'Item C', link: '/item-c' },
      //     { text: 'Item D', link: '/item-d' },
      //   ]
      // }
    ],

    socialLinks: [
      { icon: 'youtube', link: 'https://youtube.com' },
      { icon: 'discord', link: 'https://discord.gg/q5nF6mj4AV' },
    ],

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    footer: {
      message: 'Made with ❤️ by Hira',
      copyright: 'Copyright © 2024'
    }
  }
});
