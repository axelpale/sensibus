const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: 'ejs-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.png$/i,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
          publicPath: '/t/assets/'
        }
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: '[name].js',
            publicPath: 'dist/' // otherwise browser tries to download at root
          }
        }
      }
    ],
  },
  mode: 'production', // in {development, production}
  devtool: 'source-map',
}
