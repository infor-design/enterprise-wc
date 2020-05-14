const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const libraryName = 'ids-enterprise-wc';
const outputFile = `${libraryName}.min.js`;

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  optimization: {
    minimize: false
  },
  output: {
    library: libraryName,
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  devServer: {
    port: 4300,
    watchContentBase: true,
    contentBase: './',
    watchOptions: {
      poll: true
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'ids-enterprise-wc.css'
    }),
    new uglifyJsPlugin(), //eslint-disable-line
    new HTMLWebpackPlugin({
      template: 'index.html',
      inject: 'head',
      title: 'IDS Enterprise Web Components'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
