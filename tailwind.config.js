/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f8f9f0',
          100: '#eef1db',
          200: '#dde4bc',
          300: '#c7d194',
          400: '#b3bf71',
          500: '#9ea855',
          600: '#808000',
          700: '#656640',
          800: '#525136',
          900: '#464530',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};