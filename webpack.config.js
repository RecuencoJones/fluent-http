const path = require('path')
const pkg = require('./package.json')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: `${pkg.name}.js`,
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
  }
}
