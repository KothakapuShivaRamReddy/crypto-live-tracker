/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        dark: {
          100: '#1a1a2e',
          200: '#16213e',
          300: '#0f3460',
        },
        crypto: {
          green: '#00ff88',
          red: '#ff4444',
          yellow: '#ffd700',
          blue: '#4dabf7',
        },
      },
    },
  },
  plugins: [],
}