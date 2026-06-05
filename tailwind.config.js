/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-panel': '#050505',
        'bg-card': '#111827',
        'brand-cyan': '#22d3ee',
        'brand-amber': '#f59e0b',
      }
    },
  },
  plugins: [],
}