import colors, { green, red } from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      // Custom colors
      'grey': '#23272f',
      'dark': '#1a1d23',
      'cyan-blue': '#58c4dc',
      'light': '#f6f7f9',
    },
  },
  plugins: [],
}
