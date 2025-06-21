/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.vitepress/**/*.{vue,js,ts}',
    './en/**/*.{md,vue}',
    './pb/**/*.{md,vue}',
    "**/*.md", 
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};