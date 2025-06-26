import tailwindcss from "@tailwindcss/vite";
import { pagefindPlugin } from "vitepress-plugin-pagefind";
import type { UserConfig } from "vite";

export const viteConfig: UserConfig = {
  plugins: [
    tailwindcss(),
    [
      pagefindPlugin({
        excludeSelector: ["div.aside", "a.header-anchor", "[data-no-search]"], // Exclude non-content elements
        forceLanguage: "en", // Force a single index for all locales (en and pb)
        indexingCommand:
          'npx pagefind --source "docs/.vitepress/dist" --bundle-dir "pagefind"', // Ensure correct output dir
        filter: (searchItem) => {
          // Log items to debug indexing
          console.log("Indexing:", searchItem.route, searchItem.meta);
          // Include all pages except those explicitly marked as excluded
          return !searchItem.route.includes("404");
        },
      }),
    ],
  ],
  ssr: {
    noExternal: ["primevue"],
  },
  assetsInclude: [
    "**/*.webp",
    "**/*.ico",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.svg",
    "**/*.avif",
    "**/*.tiff",
    "**/*.bmp",
  ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          return `assets/[name].[ext]`;
        },
      },
    },
  },
};
