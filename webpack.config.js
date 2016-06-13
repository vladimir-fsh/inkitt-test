var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './js/main.js',
  debug: true,
  devtool: 'source-map',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
};