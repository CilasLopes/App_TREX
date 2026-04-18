/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#131313",
        surface: "#1f1f1f",
        primary: "#C3F340", // using primary color from asfalto brasa or similar vibrant
        textPrimary: "#ffffff",
        textSecondary: "#A0A0A0"
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        headings: ['"Lexend"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
