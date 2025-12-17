/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDFCF8',
        ink: '#1A1A1A',
        gold: '#D4AF37',
        'gold-muted': '#C4A030',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1A1A',
            a: {
              color: '#D4AF37',
              '&:hover': {
                color: '#C4A030',
              },
            },
            h1: {
              fontFamily: 'Playfair Display, Georgia, serif',
            },
            h2: {
              fontFamily: 'Playfair Display, Georgia, serif',
            },
            h3: {
              fontFamily: 'Playfair Display, Georgia, serif',
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
