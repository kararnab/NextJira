export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#80bfff',
          DEFAULT: '#2684FF',
          dark: '#0052CC',
        },
        bg: {
          light: '#F4F6F8',
          dark: '#0F1720',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111827',
        },
        accent: {
          1: '#FF8A80',
          2: '#FFD180',
          3: '#B9F6CA',
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,23,42,0.06)',
      }
    },
  },
  plugins: [],
}
