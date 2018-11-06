const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const merge = require('webpack-merge')
const common = require('./config.common.js')

module.exports = merge(common, {
  mode: 'production',
  plugins: [new UglifyJsPlugin()]
})
