const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // installed via npm

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: ['./app/index.js'],
    'ids-tag/ids-tag': ['./app/ids-tag/index.js'],
    'ids-icon/ids-icon': ['./app/ids-icon/index.js'],
    'ids-layout-grid/ids-layout-grid': ['./app/ids-layout-grid/index.js'],
  },
  mode: 'development',
  optimization: {
    minimize: false
  },
  output: {
    library: '[name]-lib.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    port: 4300,
    writeToDisk: true,
    contentBase: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            // Options are all in babel.config.js
            loader: 'babel-loader',
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
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    }),
    new UglifyJsPlugin(),
    new HTMLWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      title: 'IDS Enterprise Web Components',
      chunks: ['index']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-tag/index.html',
      inject: 'body',
      filename: 'ids-tag/index.html',
      chunks: ['ids-tag/ids-tag']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-icon/index.html',
      inject: 'body',
      filename: 'ids-icon/index.html',
      chunks: ['ids-icon/ids-icon']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-tag/test-compatibility.html',
      inject: 'body',
      filename: 'ids-tag/test-compatibility',
      chunks: ['ids-tag/ids-tag'],
      title: 'Test Tag Compatibility with IDS 4.0'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-layout-grid/index.html',
      inject: 'body',
      filename: 'ids-layout-grid/index.html',
      chunks: ['ids-layout-grid/ids-layout-grid']
    }),
    new StylelintPlugin({ }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
