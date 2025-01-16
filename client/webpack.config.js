const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: 'none',
  resolve: { extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'] },
  module: {
    rules: [
      { test: /\.(ts|tsx)$/, exclude: /node_modules/, use: 'ts-loader', },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new DefinePlugin({
      process: { env: {} }
    })
  ],
  devServer: {
    port: 3000,
    hot: false,
    proxy: {
      '/api/v1/hiring': {
        target: 'http://localhost:8080',
        pathRewrite: { '^/api/v1/hiring': '/api/v1/hiring' },
        changeOrigin: true,
        onError: (err, req, res) => {
          res.writeHead(504, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({
            error: 'Server is not responding',
            status: 504
          }));
        },
        onProxyError: (err, req, res) => {
          res.writeHead(504, {
            'Content-Type': 'application/json',
          });
          res.end(JSON.stringify({
            error: 'Cannot connect to server',
            status: 504
          }));
        }
      }
    }
  }
};
