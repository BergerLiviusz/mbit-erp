/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mbit-dark': '#1E1E1E',
        'mbit-blue': '#078AFF',
      },
    },
  },
  plugins: [],
}
