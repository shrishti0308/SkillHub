// Import Tailwind's default colors
import colors, { slate } from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      blue: colors.blue,
      slate: colors.slate,

      // Your custom colors
      'grey': '#23272f',
      'dark': '#1a1d23',
      'cyan-blue':'#58c4dc',
      'light': '#f6f7f9',
    },
  },
  plugins: [],
}
