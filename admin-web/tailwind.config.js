/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B4C7E',
          light: '#88AFD5',
        },
        secondary: {
          DEFAULT: '#63473A',
          light: '#9C7B6E',
        },
        background: {
          DEFAULT: '#f5f6fa',
          dark: '#1a1a2e',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
