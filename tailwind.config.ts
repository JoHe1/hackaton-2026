import type { Config } from 'tailwindcss';
import { COLORS, FONTS } from './src/theme';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        disa: {
          blue: COLORS.blue,
          yellow: COLORS.yellow,
          green: COLORS.green,
          bg: COLORS.background,
          ink: COLORS.text,
          gray: COLORS.gray,
          line: COLORS.line,
          sky: COLORS.sky,
          red: COLORS.red,
        },
      },
      fontFamily: {
        display: FONTS.display,
        sans: FONTS.body,
      },
      boxShadow: {
        card: '0 2px 10px rgba(15, 30, 46, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
