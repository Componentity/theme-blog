module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    }
  },
  variants: {
    backgroundColor: ({ after }) => after(['disabled']),
    cursor: ({ after }) => after(['disabled'])
  },
  plugins: []
}
