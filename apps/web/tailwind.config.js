const baseConfig = require('@ayurshuddhi/config/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    '../../packages/ui/**/*.{js,jsx}',
  ],
}
