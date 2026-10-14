/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#C9A961",
        },
        rose: "#B76E79",
        charcoal: "#2C2C2C",
        cream: {
          DEFAULT: "#FFF8F0",
          soft: "#FAF5EF",
        },
      },
    },
  },
  plugins: [],
};
