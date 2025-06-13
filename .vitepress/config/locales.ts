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
      // sidebar: [
      //   {
      //     text: "Tutorials",
      //     collapsed: true,
      //     items: [
      //       {
      //         text: "How to Install Mods?",
      //         link: "/en/tutorials/how-to-install-mods/",
      //         items: [
      //           {
      //             text: "For Modrinth",
      //             link: "/en/tutorials/how-to-install-mods/install-mods-in-modrinth",
      //           },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     text: "Meteor Client Addons",
      //     collapsed: true,
      //     items: [
      //       { text: "Electron", link: "/en/meteor/electron/" },
      //       { text: "Meteor Client", link: "/en/meteor/meteor-client/" },
      //       { text: "Meteor Client", link: "/en/meteor/meteor-client/" },
      //       { text: "Meteor Client", link: "/en/meteor/meteor-client/" },
      //       { text: "Meteor Client", link: "/en/meteor/meteor-client/" },
      //     ],
      //   },
      // ],
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
  },

  pb: {
    label: "ਪੰਜਾਬੀ",
    lang: "pa",
    link: "/pb/",
    themeConfig: {
      nav: [
        { text: "ਘਰ", link: "/pb/" },
        { text: "ਕ੍ਰੈਡਿਟਸ", link: "/pb/pages/credits" },
        { text: "ਮੁੱਦੇ", link: "https://discord.gg/HKubbUNNGP" },
      ],
      // sidebar: [
      //   {
      //     text: 'ਟਿਊਟੋਰਿਅਲ',
      //     collapsed: true,
      //     items: [
      //       {
      //         text: 'ਮੋਡ ਕਿਵੇਂ ਇੰਸਟਾਲ ਕਰੀਏ?',
      //         link: '/pb/tutorials/how-to-install-mods/',
      //         items: [
      //           { text: 'ਮੋਡਰਿਨਥ ਲਈ', link: '/pb/tutorials/how-to-install-mods/install-mods-in-modrinth' }
      //         ]
      //       }
      //     ]
      //   },
      //   {
      //     text: 'ਮੀਟੀਅਰ ਐਡ-ਆਨਜ਼',
      //     collapsed: true,
      //     items: [
      //       { text: 'ਇਲੈਕਟ੍ਰਾਨ', link: '/pb/meteor/electron/' }
      //     ]
      //   }
      // ],
      socialLinks: [{ icon: "discord", link: "https://discord.gg/q5nF6mj4AV" }],
      lastUpdated: {
        text: "ਅੱਪਡੇਟ ਕੀਤਾ ਗਿਆ",
        formatOptions: {
          dateStyle: "full",
          timeStyle: "medium",
        },
      },
      footer: {
        message: "ਨਿਊਜ਼ੀਲੈਂਡ ਵਿੱਚ ਪਿਆਰ ਨਾਲ ਬਣਾਇਆ ਗਿਆ",
        copyright: "2025 © ਹਰਮਨ ਸਿੰਘ ਹੀਰਾ",
      },
    },
  },
};
