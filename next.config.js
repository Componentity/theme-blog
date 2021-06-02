const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public'
  },
  images: {
    domains: ['reporterly.net']
  },
  future: {
    webpack5: true
  }
})
