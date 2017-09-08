const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const pkg = require('./package.json')
const plugins = []

let name = pkg.name
let devtool = 'inline-source-map'

if (process.env.NODE_ENV === 'production') {
  plugins.push(new UglifyJsPlugin())
  plugins.push(new webpack.SourceMapDevToolPlugin({
    filename: '[name].js.map'
  }))
  name = `${name}.min`
  devtool = 'source-map'
}

module.exports = {
  entry: './src/index.js',
  output: {
    filename: `${name}.js`,
    path: path.resolve('./dist'),
    libraryTarget: 'umd',
    library: 'fluentHttp'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins,
  devtool
}
