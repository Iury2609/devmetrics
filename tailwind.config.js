/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { bg: 'var(--bg)', panel: 'var(--panel)', panel2: 'var(--panel2)', line: 'var(--line)', ink: 'var(--ink)', mute: 'var(--mute)', accent: 'var(--accent)', accent2: 'var(--accent2)', ok: 'var(--ok)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'] },
    },
  },
  plugins: [],
}
