const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }]
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: 'index.html'
    })
  ],
  mode: 'development'
}
