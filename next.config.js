const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development'
  },
  images: {
    domains: ['reporterly.net', 'wp.en.aleteia.org']
  },
  future: {
    webpack5: true
  }
})
