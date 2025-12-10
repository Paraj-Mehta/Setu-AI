/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'abfrl-green': '#1a5f3f',
        'abfrl-dark-green': '#0d3d26',
        'abfrl-gold': '#d4af37',
        'abfrl-light-gold': '#f4e4bc',
      },
    },
  },
  plugins: [],
}


