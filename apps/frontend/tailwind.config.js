/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pancasila: {
          blue: '#0033A0',
          'blue-dark': '#002880',
          'blue-light': '#4A90D9',
          gold: '#FFD700',
          'gold-dark': '#E6C200',
        }
      }
    },
  },
  plugins: [],
}