/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.vitepress/**/*.{vue,js,ts}',
    './en/**/*.{md,vue}',
    './pb/**/*.{md,vue}',
    '**/*.md',
    './.vitepress/theme/components/**/*.{vue,js,ts}',
    './.vitepress/theme/layouts/**/*.{vue,js,ts}',
    './.vitepress/theme/styles/**/*.{css,scss}',
    './.vitepress/theme/index.{js,ts}',
    
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};