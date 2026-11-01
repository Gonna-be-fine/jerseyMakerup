/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 使用 class 策略来切换暗色模式
  content: [
    "./index.html",
    "./src/**/*.{js,vue}",
  ],
  theme: {
    extend: {
      colors: {
        darker: '#090d16',
        dark: '#0f172a',
        primary: {
          DEFAULT: '#4f46e5',
          light: '#6366f1',
          dark: '#3730a3'
        },
        secondary: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2'
        },
        background: {
          DEFAULT: '#fafafa',
          light: '#ffffff',
          dark: '#090d16'
        },
        text: {
          DEFAULT: '#1e293b',
          light: '#475569',
          dark: '#0f172a'
        }
      },
      fontFamily: {
        primary: ['Poppins', 'sans-serif'],
        secondary: ['Inter', 'sans-serif'],
        body: ['system-ui', 'sans-serif']
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        }
      }
    },
  },
  plugins: [],
}

