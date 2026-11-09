import type { Config } from 'tailwindcss';

// Palette taken from the master-branch frontend (app.contex.jsx `colors`).
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1320px' } },
    extend: {
      colors: {
        navy: { DEFAULT: '#082A58', dark: '#061F42' },
        gold: { DEFAULT: '#FFBC13', dark: '#E5A800' },
        flame: '#F06D06',
        ink: '#252525',
      },
      keyframes: {
        pulsate: {
          '0%': { transform: 'scale(0.6)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      animation: { pulsate: 'pulsate 2s steps(20) infinite' },
    },
  },
  plugins: [],
};
export default config;
