/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", /* Looks inside /src folder */
    "./*.{js,ts,jsx,tsx}"          /* Looks in root folder */
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
