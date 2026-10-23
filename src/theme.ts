// DISA brand tokens. Also consumed by tailwind.config.ts.
//
// Typography: the official app uses Roboto (Android system font) for body text and
// labels, and a rounded humanist sans for titles ("Tu Club", "Promociones").
// We use Barlow for titles (closest free match, Google Fonts) and Roboto for body.
// Both are bundled via @fontsource so the demo works offline.
export const COLORS = {
  blue: '#1D5798',
  yellow: '#F6CC19',
  green: '#0A8247',
  background: '#F4F7FA',
  text: '#0F1E2E',
  gray: '#627080',
  line: '#E1E7EE',
  // Light blue border used on shortcut tiles in the official app.
  sky: '#C9DAEE',
  // Error tone for security toasts.
  red: '#C62828',
} as const;

export const FONTS = {
  display: ['Barlow', 'Roboto', 'sans-serif'],
  body: ['Roboto', 'system-ui', 'sans-serif'],
};
