/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        'electric-blue': '#0078D7',
        'dark-gray': '#333333',
        'light-bg': '#f9fafb',
      },
    },
  },
  plugins: [],
}