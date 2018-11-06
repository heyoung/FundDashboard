const merge = require('webpack-merge')
const common = require('./config.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development'
})
