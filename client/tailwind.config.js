/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Lora"', 'Georgia', 'serif'],
        hand:    ['"Caveat"', 'cursive'],
      },
      colors: {
        parchment: {
          DEFAULT: '#faf6ef',
          dark:    '#f0e9dc',
        },
        ink: {
          DEFAULT: '#2c2416',
          light:   '#5c4f3a',
        },
        sage: {
          DEFAULT: '#4a6e3a',
          light:   '#6a9457',
          bg:      '#eef4ea',
        },
        terracotta: {
          DEFAULT: '#b85c3a',
          light:   '#e07d5a',
        },
        gold: '#c89840',
      },
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
};
