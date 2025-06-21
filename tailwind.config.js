/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.vitepress/**/*.{vue,js,ts}', // Include Vitepress theme files
    './en/**/*.{md,vue}', // Include Markdown and Vue files in the `en` directory
    './pb/**/*.{md,vue}', // Include other directories if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};