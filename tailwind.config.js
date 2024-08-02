import { indigoColors } from "./src/colors/indigo";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Inter: ['"Inter"', "sans-serif"],
      },
      colors: {
        primary: {
          ...indigoColors,
        },
        textDefault: "#000853",
        textMuted: "#898da9",
        backgroundAccent: indigoColors[100],
        borderDefault: indigoColors[200],
        borderActive: indigoColors[600],
        cta: {
          default: indigoColors[600],
          disabled: indigoColors[200],
          hover: indigoColors[700],
        },
        icon: {
          light: "#cbb6e5",
          default: "#000853",
          danger: "#ed4545",
        },
        fontFamily: {
          DmSans: ['"DM Sans"', "sans-serif"],
        },
      },
    },
  },
  plugins: [],
};
