/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Consolas', 'Courier New', 'monospace'],
      },
      colors: {
        'portfolio-bg': '#0A0E17',
        'portfolio-blue': '#C8D8FF',
      }
    },
  },
  plugins: [],
}