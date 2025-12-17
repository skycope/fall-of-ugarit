/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Book cover blues
        'deep-blue': '#153b9d',
        'mid-blue': '#2c55cc',
        'light-blue': '#d4dff9',
        'sea-blue': '#1e4bb8',

        // Gold accents
        gold: '#ffb102',
        'gold-dark': '#e6a000',
        'gold-light': '#ffc942',

        // Legacy (keeping for compatibility)
        cream: '#d4dff9',
        ink: '#153b9d',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cover-gradient': 'linear-gradient(180deg, #153b9d 0%, #2c55cc 50%, #1e4bb8 100%)',
        'gold-stroke': 'linear-gradient(90deg, transparent 0%, #ffb102 10%, #ffb102 90%, transparent 100%)',
      },
      animation: {
        'draw': 'draw 2s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'paint-stroke': 'paintStroke 1.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
      },
      keyframes: {
        draw: {
          '0%': { strokeDashoffset: '1000', opacity: '0' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        paintStroke: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(10px) rotate(2deg)' },
          '75%': { transform: 'translateX(-10px) rotate(-2deg)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#d4dff9',
            a: {
              color: '#ffb102',
              '&:hover': {
                color: '#ffc942',
              },
            },
            h1: {
              fontFamily: 'Playfair Display, Georgia, serif',
              color: '#ffb102',
            },
            h2: {
              fontFamily: 'Playfair Display, Georgia, serif',
              color: '#ffb102',
            },
            h3: {
              fontFamily: 'Playfair Display, Georgia, serif',
              color: '#d4dff9',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
