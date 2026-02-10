/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        cream: {
          50: '#fefdf8',
          100: '#fdf9e7',
          200: '#faf2c5',
          300: '#f6e89f',
          400: '#f0d96b',
          500: '#e8c547',
          600: '#d4a93a',
          700: '#b08a2f',
          800: '#8f6d2a',
          900: '#755825',
        }
      },
    },
  },
  plugins: [],
}
