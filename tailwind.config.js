// file used for customization of tailwind

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./index.css", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      adlam: ["ADLaM Display", "cursive"],
      lato: ["Lato", "sans-serif"],
    },
  },
  plugins: [],
};
