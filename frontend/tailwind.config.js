/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e3ecff',
          200: '#d4e3ff',
          300: '#667eea',
          400: '#5568d3',
          500: '#667eea',
          600: '#764ba2',
          700: '#5a3a7f',
          800: '#3d2856',
          900: '#1f142b',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to avoid conflicts
  },
}
