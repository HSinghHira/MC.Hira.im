import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  title: "Minecraft Wala Bro",

  description: "Minecraft Related Tutorial and Downloads",

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
