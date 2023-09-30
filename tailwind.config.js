const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    fontFamily: {
      sans: ["Open Sans", "Helvetica", "sans-serif"],
      heading: ["Montserrat", "Helvetica", "sans-serif"],
    },
    extend: {
      colors: {
        bdk: {
          "blue-darkest": "#0a1c29",
          "blue-darker": "#184567",
          "blue-dark": "#276ea5",
          blue: "#4f97d1",
          "blue-light": "#5aa1d8",
          "blue-lighter": "#acd0ec",
          "blue-lightest": "#eaf3fa",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwindcss-hero-patterns"),
  ],
};
