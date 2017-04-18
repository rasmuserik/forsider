let webpack = require('webpack');
module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  devtool: 'source-map',
  module: {loaders: [{ 
    test: /\.js$/, 
    exclude: /(dist.*|node_modules)/, 
    loader: 'babel-loader'
  }]},
  plugins: [
    new webpack.IgnorePlugin(/^(fs|child_process)$/)
  ],
  output: {
    libraryTarget: 'umd',
    filename: 'dist.js'
  }
}
