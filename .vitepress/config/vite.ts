import tailwindcss from "@tailwindcss/vite";
import { pagefindPlugin } from "vitepress-plugin-pagefind";
import type { UserConfig } from "vite";

export const viteConfig: UserConfig = {
  plugins: [
    tailwindcss(),
    pagefindPlugin({
      excludeSelector: ["div.aside", "a.header-anchor", "[data-no-search]"],
      indexingCommand: 'pagefind --site "docs/.vitepress/dist" --bundle-dir "pagefind" --glob "**/*.html" --verbose',
      filter: (searchItem) => {
        console.log("Indexing route:", searchItem.route, "Meta:", searchItem.meta);
        return !searchItem.route.includes("404");
      },
    }),
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
        assetFileNames: (assetInfo) => `assets/[name].[ext]`,
      },
    },
  },
};