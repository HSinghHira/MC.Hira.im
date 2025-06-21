export default {
  "content": [
    // Remove the docs/ prefix since your content is in the root
    "./**/*.{vue,js,ts,jsx,tsx,md}",
    "./.vitepress/**/*.{vue,js,ts,jsx,tsx,md}",
    // Specifically include your content directories
    "./en/**/*.{vue,js,ts,jsx,tsx,md}",
    "./pb/**/*.{vue,js,ts,jsx,tsx,md}",
    "./*.md", // for any root level markdown files
  ],
  "theme": {
    "extend": {}
  },
  "plugins": []
}