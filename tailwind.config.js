/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand:   '#4F46E5',
        rose:    '#F43F5E',
        emerald: '#10B981',
        amber:   '#F59E0B',
        base: {
          500: '#1A1A2E',
          600: '#0F0F1A',
          700: '#080810',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
