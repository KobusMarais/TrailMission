module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#FACC15",
        accent: "#F97316",
        background: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      borderRadius: { xl: "1rem" },
      boxShadow: { card: "0 4px 12px rgba(0,0,0,0.1)" },
    },
  },
  plugins: [],
};
