/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.vitepress/**/*.{vue,js,ts,mjs}',
    './.vitepress/theme/**/*.{vue,js,ts}',
    './.vitepress/components/**/*.{vue,js,ts}',
    './en/**/*.{md,vue}',
    './pb/**/*.{md,vue}',
    './**/*.md',
    './index.md'
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Disable some conflicting plugins that might interfere with VitePress
    preflight: false,
  }
};