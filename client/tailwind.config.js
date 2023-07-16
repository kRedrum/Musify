/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        semantics: {
          warning: '#FFBE0F',
          error: '#BD2000',
          success: '#1A5D1A',
          info: '#2196F3'
        },
        primary: '#393E46',
        background: '#222831',
        accent: {
          positive: '#7BC74D',
          negative: '#BD2000'
        }
      },
      screens: {
        mobile: '640px',
        tablet: '768px',
        laptop: '1024px',
        desktop: '1280px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
}
