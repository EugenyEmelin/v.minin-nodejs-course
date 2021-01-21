console.log(process.env.NODE_ENV, 'NODE_ENV')

if (process.env.NODE_ENV === 'production') {
  console.log('production mode')
  module.exports = require('./keys.prod')
} else {
  console.log('dev mode')
  module.exports = require('./keys.dev')
}