/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        upper: {
          "0%": {
            transform: "translate3d(-100px, 0, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
      },
    },
    colors: {
      gray: {
        100: "#F8F8F8",
        200: "#FEFEFE",
        300: "#EBEBEB",
        400: "#7E7E86",
        800: "#29292E",
        900: "#0E0E10",
      },
      white: colors.white,
      indigo: colors.indigo,
      zinc: colors.zinc,
      emerald: colors.emerald,
      amber: colors.amber,
      red: colors.red,
    },
  },
  plugins: [],
};
