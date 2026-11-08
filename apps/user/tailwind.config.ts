import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wheat: {
          50: '#FDFBF7',
          100: '#FBF5E8',
          200: '#F5E6C4',
          300: '#EED39A',
          400: '#E4BD6B',
          500: '#D49B37',
          600: '#BA7E26',
          700: '#945F1B',
          800: '#754917',
          900: '#5A3611',
        },
        slateIron: {
          800: '#15253e',
          900: '#0b192c',
          950: '#07101e',
        },
        milledCream: {
          50: '#FAF8F4',
          100: '#F5F1E8',
          200: '#EAE3D2',
          300: '#DCD1B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
