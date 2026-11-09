// Design tokens — see DESIGN.md §3.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1.25rem", md: "2rem" }, screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        silo: { DEFAULT: "#0B3B55", 700: "#082D41", 300: "#2C6585" },
        gold: { DEFAULT: "#EEAD0F", 600: "#D69A06" },
        // steel-400: hairlines/dividers only. steel-600: control borders (≥3:1 on Flour and Steel, WCAG 1.4.11).
        steel: { DEFAULT: "#E4E8EA", 400: "#B9C2C7", 600: "#74838D" },
        ink: { DEFAULT: "#14283A", 600: "#4A5D6C" },
        flour: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
      },
      // 1.25 modular scale (DESIGN.md): 14 / 16 / 17 body / 20 / 25 / 31 / 39 / 61
      fontSize: {
        sm: ["0.875rem", { lineHeight: "1.45" }],
        base: ["1.0625rem", { lineHeight: "1.6" }],
        lg: ["1.25rem", { lineHeight: "1.5" }],
        xl: ["1.5625rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "2xl": ["1.9375rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "3xl": ["2.4375rem", { lineHeight: "1.12", letterSpacing: "-0.015em" }],
        "4xl": ["3.8125rem", { lineHeight: "1.04", letterSpacing: "-0.02em" }],
      },
      maxWidth: { prose: "68ch" },
      borderRadius: { control: "6px", photo: "2px" },
    },
  },
  plugins: [],
};
