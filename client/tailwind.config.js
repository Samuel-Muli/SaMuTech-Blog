/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",
        "ink-soft": "#16203A",
        paper: "#F7F8FA",
        border: "#E2E5EA",
        muted: "#5B6472",
        amber: {
          DEFAULT: "#D97706",
          light: "#F59E0B",
          50: "#FEF3E2",
        },
        teal: {
          DEFAULT: "#0D9488",
          50: "#E6F6F4",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11, 18, 32, 0.04), 0 8px 24px -8px rgba(11, 18, 32, 0.08)",
      },
    },
  },
  plugins: [],
}

