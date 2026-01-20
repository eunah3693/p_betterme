/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',  // src 폴더 전체를 포함
  ],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '1024px',
        xl: '1920px',
      },
      colors: {
        'main': '#0d205d',
        'sub': '#6472df',
        'info': '#111111',
        'gray3': '#333333',
        'gray4': '#eee',
        'desc': '#c7c7c7',
        'caution': '#c72f25',
        'highlight': '#96697d',
      },
      fontFamily: {
        notoSans: ['Noto Sans KR', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
}