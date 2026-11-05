/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: "#F8F6EF",
        forest: "#173B1B",
        farm: "#287A2B",
        "farm-light": "#CDE8C8",
      },
    },
  },
  plugins: [],
};
