const path = require('path')
const fs = require('fs')

module.exports = {
  entry: {
    dashboard: path.resolve(__dirname, '..', 'src', 'pages', 'dashboard.tsx')
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            ...JSON.parse(
              fs.readFileSync(path.resolve(__dirname, '../../../.babelrc'))
            )
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../', 'server', 'dist', 'js')
  }
}
