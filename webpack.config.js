const path = require('path');

module.exports = {
  context: __dirname,
  entry: './js/index.js',
  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js'
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  module: {
    //preLoaders: [
    //  {
    //    test: /\.jsx?$/,
    //    loader: "eslint-loader",
    //    exclude: /node_modules/
    //  }
    //],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
      }
    ]
  }
}
