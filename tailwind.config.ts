import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'orange': '#FF4A01',
        'gray': '#33343F',
        'gray-light': 'rgb(113,115,127)',
      },
    },
  },
  plugins: [],
} satisfies Config
