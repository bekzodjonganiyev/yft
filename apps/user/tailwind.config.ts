import type { Config } from 'tailwindcss';

// Palette and font from the version_2_1_0 frontend (tailwind.config.cjs).
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#EEAD0F', dark: '#D69B0B' },
        secondary: { DEFAULT: '#063F58', dark: '#04304A' },
        navy: '#0B2A5A',
        flame: '#F06D06',
        mist: '#F0F0F0',
      },
      fontFamily: {
        sans: ['var(--font-plex)', 'var(--font-plex-arabic)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
