import type { LocaleConfig } from "vitepress";

export const locales: LocaleConfig = {
  root: {
    label: "English",
    lang: "en",
    link: "/en/",
    themeConfig: {
      logo: '/data/icons/logo.png',
      nav: [
        { text: "Home", link: "/en/" },
        { text: "Credits", link: "/en/pages/credits" },
        { text: "Report Issues", link: "https://discord.gg/HKubbUNNGP" },
      ],
      socialLinks: [
        {
          icon: "discord",
          link: "https://discord.gg/q5nF6mj4AV",
          ariaLabel: "Join us on Discord"
        },
        {
          icon: "github",
          link: "https://github.com/HSinghHira/",
          ariaLabel: "Join us on GitHub"
        },
        {
          icon: "youtube",
          link: "https://www.youtube.com/@HarmanSinghHira",
          ariaLabel: "Subscribe to my YouTube channel"
        },
        {
          icon: "buymeacoffee",
          link: "https://buymeacoffee.com/hsinghhira",
          ariaLabel: "Buy me a coffee"
        },

      ],
      lastUpdated: {
        text: "Updated at",
        formatOptions: {
          dateStyle: "full",
          timeStyle: "medium",
        },
      },
      footer: {
        message: "This website is not affiliated with, endorsed by, or officially connected to Mojang, the creators of Minecraft. All trademarks and registered trademarks are the property of their respective owners.",
        copyright: "Made with ❤️ in New Zealand by Harman Singh Hira",
      },
    },
  }
};
