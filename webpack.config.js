const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sass = require('node-sass');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: ['./app/index.js'],
    'ids-icon/ids-icon': ['./app/ids-icon/index.js'],
    'ids-label/ids-label': ['./app/ids-label/index.js'],
    'ids-layout-grid/ids-layout-grid': ['./app/ids-layout-grid/index.js'],
    'ids-popup/ids-popup': ['./app/ids-popup/index.js'],
    'ids-popup/test-sandbox': ['./app/ids-popup/test-sandbox.js'],
    'ids-popup/test-target-in-grid': ['./app/ids-popup/test-target-in-grid.js'],
    'ids-tag/ids-tag': ['./app/ids-tag/index.js'],
    'ids-validation-message/ids-validation-message': ['./app/ids-validation-message/index.js'],
    'ids-field/ids-field': ['./app/ids-field/index.js']
  },
  devtool: 'cheap-source-map', // try source-map for prod
  mode: 'development',
  optimization: {
    minimize: false, // try true for prod
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
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
        test: /\.html$/,
        loader: 'handlebars-loader'
      },
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
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'app')
        ],
        use: [
          'sass-to-string',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'nested' // 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'src')
        ],
        use: [
          // Creates `style` nodes from JS strings
          {
            loader: 'style-loader',
            options: {
              attributes: {
                id: 'demo-styles',
                nonce: '0a59a005' // @TODO needs to match a global nonce instance
              }
            }
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ]
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
    new FaviconsWebpackPlugin('app/assets/favicon.ico'),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    }),
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
      title: 'IDS Tag Component',
      chunks: ['ids-tag/ids-tag', 'ids-label/ids-label', 'ids-icon/ids-icon', 'ids-layout-grid/ids-layout-grid']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-icon/index.html',
      inject: 'body',
      filename: 'ids-icon/index.html',
      title: 'IDS Icon Component',
      chunks: ['ids-icon/ids-icon', 'ids-label/ids-label', 'ids-layout-grid/ids-layout-grid']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-label/index.html',
      inject: 'body',
      filename: 'ids-label/index.html',
      title: 'IDS Label Component',
      chunks: ['ids-label/ids-label', 'ids-layout-grid/ids-layout-grid']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-tag/compatibility.html',
      inject: 'body',
      filename: 'ids-tag/compatibility',
      chunks: ['ids-tag/ids-tag', 'ids-label/ids-label', 'ids-icon/ids-icon', 'ids-layout-grid/ids-layout-grid'],
      title: 'Test Tag Compatibility with IDS 4.0'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-tag/standalone-css.html',
      inject: 'body',
      filename: 'ids-tag/standalone-css',
      chunks: ['ids-tag/ids-tag', 'ids-label/ids-label', 'ids-icon/ids-icon', 'ids-layout-grid/ids-layout-grid'],
      title: 'Tag - Standalone Css'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-layout-grid/index.html',
      inject: 'body',
      filename: 'ids-layout-grid/index.html',
      chunks: ['ids-layout-grid/ids-layout-grid', 'ids-label/ids-label'],
      title: 'IDS Layout Grid'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-layout-grid/standalone-css.html',
      inject: 'body',
      filename: 'ids-layout-grid/standalone-css',
      chunks: ['ids-layout-grid/ids-layout-grid', 'ids-label/ids-label'],
      title: 'IDS Layout Grid - Standalone Css'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-layout-grid/test-sandbox.html',
      inject: 'body',
      filename: 'ids-layout-grid/test-sandbox',
      chunks: ['ids-layout-grid/ids-layout-grid', 'ids-label/ids-label'],
      title: 'IDS Layout Grid - Sandbox'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-trigger-field/index.html',
      inject: 'body',
      filename: 'ids-trigger-field/index.html',
      title: 'IDS Trigger Field'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-popup/index.html',
      inject: 'body',
      filename: 'ids-popup/index.html',
      chunks: ['ids-popup/ids-popup'],
      title: 'IDS Popup Component'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-popup/test-sandbox.html',
      inject: 'body',
      filename: 'ids-popup/test-sandbox',
      chunks: ['ids-popup/test-sandbox'],
      title: 'Popup Test - Sandbox'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-popup/test-target-in-grid.html',
      inject: 'body',
      filename: 'ids-popup/test-target-in-grid',
      chunks: ['ids-popup/test-target-in-grid'],
      title: 'Popup Test - Align Target inside a Layout Grid'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-validation-message/index.html',
      inject: 'body',
      filename: 'ids-validation-message/index.html',
      title: 'IDS Validation Message'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-field/index.html',
      inject: 'body',
      filename: 'ids-field/index.html',
      title: 'IDS Field'
    }),
    // Show Style Lint Errors in the console and fail
    new StylelintPlugin({}),
    // Handle Hot Swap When files change - files must be added via entry points
    new webpack.HotModuleReplacementPlugin(),
    // Make a Copy of the Sass Files only for standalone Css
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/**/*.scss', // './src/**/*.scss'
          transformPath(targetPath) {
            return targetPath.replace('src', '').replace('.scss', '.css');
          },
          transform(content, transFormPath) {
            const result = sass.renderSync({
              file: transFormPath
            });
            let css = result.css.toString();
            css = css.replace(':host {', ':root {');
            return css;
          }
        },
        {
          from: './src/**/*.d.ts',
          transformPath(targetPath) {
            return targetPath.replace('src', '');
          },
        }
      ]
    }),
  ]
};
