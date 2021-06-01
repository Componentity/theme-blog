module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    backgroundColor: ({ after }) => after(['disabled']),
    cursor: ({ after }) => after(['disabled'])
  },
  plugins: []
}
