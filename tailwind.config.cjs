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
        overlayShow: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        overlayHide: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        contentShow: {
          "0%": {
            opacity: 0,
            transform: "translate3D(-50%, calc(-50% + 20px), 0) scale(0.9)",
          },
          "100%": {
            opacity: 1,
            transform: "translate3D(-50%, -50%, 0) scale(1)",
          },
        },
        contentHide: {
          "0%": {
            opacity: 1,
            transform: "translate3D(-50%, -50%, 0) scale(9)",
          },
          "100%": {
            opacity: 0,
            transform: "translate3D(-50%, calc(-50% + 20px), 0) scale(1)",
          },
        },
      },
      animation: {
        openWrapper: "contentShow .3s ease-in",
        closeWrapper: "contentHide .3s ease-out",
        openOverlay: "overlayShow .2s ease-out",
        closeOverlay: "overlayHide .2s ease-out",
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
