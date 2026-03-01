/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        accent: "#10B981",
        darkbg: "#0F172A",
        card: "#111827",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(79,70,229,0.4)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 30% 30%, rgba(79,70,229,0.15), transparent 40%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.15), transparent 40%)",
      },
    },
  },
  plugins: [],
};