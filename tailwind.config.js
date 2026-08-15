/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#4B164C',
          50: '#F6ECF6',
          100: '#EAD3EB',
          200: '#D2A2D4',
          300: '#B970BC',
          400: '#9A4A9E',
          500: '#4B164C',
          600: '#3F1240',
          700: '#330E34',
          800: '#270A28',
          900: '#1B071C',
        },
        cream: '#FFF9F3',
        coral: {
          DEFAULT: '#FF5A5F',
          50: '#FFF0F0',
          100: '#FFE0E1',
          200: '#FFB8BA',
          300: '#FF9093',
          400: '#FF7A7E',
          500: '#FF5A5F',
          600: '#E84045',
          700: '#C42227',
        },
        ink: '#171717',
        grey: {
          DEFAULT: '#6B6B6B',
          100: '#F2F0F1',
          200: '#E4E1E2',
          300: '#C9C5C6',
        },
        success: {
          DEFAULT: '#16855B',
          50: '#E7F5EF',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 16px rgba(23, 23, 23, 0.06)',
        'card-hover': '0 12px 32px rgba(75, 22, 76, 0.16)',
        pop: '0 8px 24px rgba(23, 23, 23, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'slide-up': { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'slide-down': { '0%': { opacity: 0, transform: 'translateY(-8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        'pop-heart': { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.35)' }, '100%': { transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'pop-heart': 'pop-heart 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
