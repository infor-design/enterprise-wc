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
    'ids-button/ids-button': ['./app/ids-button/index.js'],
    'ids-checkbox/ids-checkbox': ['./app/ids-checkbox/index.js'],
    'ids-icon/ids-icon': ['./app/ids-icon/index.js'],
    'ids-input/ids-input': ['./app/ids-input/index.js'],
    'ids-input/test-validation-message': ['./app/ids-input/test-validation-message.js'],
    'ids-text/ids-text': ['./app/ids-text/index.js'],
    'ids-layout-grid/ids-layout-grid': ['./app/ids-layout-grid/index.js'],
    'ids-popup/ids-popup': ['./app/ids-popup/index.js'],
    'ids-popup/test-sandbox': ['./app/ids-popup/test-sandbox.js'],
    'ids-popup/test-target-in-grid': ['./app/ids-popup/test-target-in-grid.js'],
    'ids-tag/ids-tag': ['./app/ids-tag/index.js'],
    'ids-toggle-button/ids-toggle-button': ['./app/ids-toggle-button/index.js'],
    'ids-trigger-field/ids-trigger-field': ['./app/ids-trigger-field/index.js'],
    'ids-radio/ids-radio': ['./app/ids-radio/index.js'],
    'ids-render-loop/ids-render-loop': ['./app/ids-render-loop/index.js'],
    'ids-render-loop/test-elapsed-time': ['./app/ids-render-loop/test-elapsed-time.js'],
    'ids-render-loop/test-flying-popup': ['./app/ids-render-loop/test-flying-popup.js'],
    'ids-switch/ids-switch': ['./app/ids-switch/index.js']
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
      template: './app/ids-button/index.html',
      inject: 'body',
      filename: 'ids-button/index.html',
      title: 'IDS Button Component',
      chunks: ['ids-button/ids-button']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-button/icon-button.html',
      inject: 'body',
      filename: 'ids-button/icon-button',
      chunks: ['ids-button/ids-button', 'ids-button/icon-button'],
      title: 'IDS Icon Button Component'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-button/disabled-button.html',
      inject: 'body',
      filename: 'ids-button/disabled-button',
      chunks: ['ids-button/ids-button', 'ids-button/disabled-button'],
      title: 'IDS Button Component (disabled state)'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-toggle-button/index.html',
      inject: 'body',
      filename: 'ids-toggle-button/index.html',
      chunks: ['ids-toggle-button/ids-toggle-button'],
      title: 'IDS Toggle Button Component'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-button/test-fallback-slot.html',
      inject: 'body',
      filename: 'ids-button/test-fallback-slot',
      chunks: ['ids-button/ids-button'],
      title: 'IDS Button Component using an unnamed slot for content'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-checkbox/index.html',
      inject: 'body',
      filename: 'ids-checkbox/index.html',
      title: 'IDS Checkbox Component',
      chunks: ['ids-checkbox/ids-checkbox']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-checkbox/standalone-css.html',
      inject: 'body',
      filename: 'ids-checkbox/standalone-css.html',
      title: 'IDS Checkbox Component - Standalone-css',
      chunks: []
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-tag/index.html',
      inject: 'body',
      filename: 'ids-tag/index.html',
      title: 'IDS Tag Component',
      chunks: ['ids-tag/ids-tag', 'ids-text/ids-text', 'ids-icon/ids-icon', 'ids-layout-grid/ids-layout-grid']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-icon/index.html',
      inject: 'body',
      filename: 'ids-icon/index.html',
      title: 'IDS Icon Component',
      chunks: ['ids-icon/ids-icon', 'ids-text/ids-text', 'ids-layout-grid/ids-layout-grid']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-input/index.html',
      inject: 'body',
      filename: 'ids-input/index.html',
      title: 'IDS Input Component',
      chunks: ['ids-input/ids-input']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-input/test-validation-message.html',
      inject: 'body',
      filename: 'ids-input/test-validation-message.html',
      title: 'IDS Input Component - Validation Message',
      chunks: ['ids-input/test-validation-message']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-text/index.html',
      inject: 'body',
      filename: 'ids-text/index.html',
      title: 'IDS Text Component',
      chunks: ['ids-text/ids-text', 'ids-layout-grid/ids-layout-grid']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-tag/compatibility.html',
      inject: 'body',
      filename: 'ids-tag/compatibility',
      chunks: ['ids-tag/ids-tag', 'ids-text/ids-text', 'ids-icon/ids-icon', 'ids-layout-grid/ids-layout-grid'],
      title: 'Test Tag Compatibility with IDS 4.0'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-tag/standalone-css.html',
      inject: 'body',
      filename: 'ids-tag/standalone-css',
      chunks: ['ids-tag/ids-tag', 'ids-text/ids-text', 'ids-icon/ids-icon', 'ids-layout-grid/ids-layout-grid'],
      title: 'Tag - Standalone Css'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-layout-grid/index.html',
      inject: 'body',
      filename: 'ids-layout-grid/index.html',
      chunks: ['ids-layout-grid/ids-layout-grid', 'ids-text/ids-text'],
      title: 'IDS Layout Grid'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-layout-grid/standalone-css.html',
      inject: 'body',
      filename: 'ids-layout-grid/standalone-css',
      chunks: ['ids-layout-grid/ids-layout-grid', 'ids-text/ids-text'],
      title: 'IDS Layout Grid - Standalone Css'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-layout-grid/test-sandbox.html',
      inject: 'body',
      filename: 'ids-layout-grid/test-sandbox',
      chunks: ['ids-layout-grid/ids-layout-grid', 'ids-text/ids-text'],
      title: 'IDS Layout Grid - Sandbox'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-trigger-field/index.html',
      inject: 'body',
      filename: 'ids-trigger-field/index.html',
      chunks: ['ids-trigger-field/ids-trigger-field'],
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
      template: './app/ids-radio/index.html',
      inject: 'body',
      filename: 'ids-radio/index.html',
      title: 'IDS Radio Component',
      chunks: ['ids-radio/ids-radio']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-radio/standalone-css.html',
      inject: 'body',
      filename: 'ids-radio/standalone-css.html',
      title: 'IDS Radio Component - Standalone-css',
      chunks: []
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-render-loop/index.html',
      inject: 'body',
      filename: 'ids-render-loop/index.html',
      chunks: ['ids-render-loop/ids-render-loop'],
      title: 'IDS RenderLoop'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-render-loop/test-elapsed-time.html',
      inject: 'body',
      filename: 'ids-render-loop/test-elapsed-time',
      chunks: ['ids-render-loop/test-elapsed-time'],
      title: 'RenderLoop Test - Elapsed Time'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-render-loop/test-flying-popup.html',
      inject: 'body',
      filename: 'ids-render-loop/test-flying-popup',
      chunks: ['ids-render-loop/test-flying-popup'],
      title: 'RenderLoop Test - Flying Popup'
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-switch/index.html',
      inject: 'body',
      filename: 'ids-switch/index.html',
      title: 'IDS Switch Component',
      chunks: ['ids-switch/ids-switch']
    }),
    new HTMLWebpackPlugin({
      template: './app/ids-switch/standalone-css.html',
      inject: 'body',
      filename: 'ids-switch/standalone-css.html',
      title: 'IDS Switch Component - Standalone-css',
      chunks: []
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
