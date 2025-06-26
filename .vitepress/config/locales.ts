import type { LocaleConfig } from "vitepress";

export const locales: LocaleConfig = {
  root: {
    label: "English",
    lang: "en",
    link: "/en/",
    themeConfig: {
      nav: [
        { text: "Home", link: "/en/" },
        { text: "Credits", link: "/en/pages/credits" },
        { text: "Issues", link: "https://discord.gg/HKubbUNNGP" },
      ],
      socialLinks: [{ icon: "discord", link: "https://discord.gg/q5nF6mj4AV" }],
      lastUpdated: {
        text: "Updated at",
        formatOptions: {
          dateStyle: "full",
          timeStyle: "medium",
        },
      },
      footer: {
        message: "Made with ❤️ in New Zealand",
        copyright: "2025 © Harman Singh Hira",
      },
    },
  }
};
