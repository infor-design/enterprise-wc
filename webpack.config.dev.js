const path = require('path');
const sass = require('sass');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const demoEntry = require('./scripts/webpack-dev-entery')
const WebpackHtmlExamples = require('./scripts/webpack-html-templates');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  entry: () => demoEntry(),
  output: {
    chunkFormat: 'module',
    path: path.resolve(__dirname, './build/development'),
    filename: '[name]/[name].[contenthash].js',
    clean: true,
    publicPath: '/'
  },
  mode: isProduction ? 'production' : 'development',
  optimization: {
    splitChunks: {
      chunks: 'async'
    },
  },
  infrastructureLogging: {
    level: 'error' // or 'verbose' if any debug info is needed
  },
  devServer: {
    hot: false,
    liveReload: false,
    port: 4300,
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: path.resolve(__dirname, `./build/demos/${isProduction ? 'production' : 'development'}`),
      watch: false
    }
  },
  devtool: 'cheap-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            // Options are all in babel.config.js
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'build')
        ],
        use: [
          'sass-to-string',
          {
            loader: 'sass-loader',
          }
        ],
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'src')
        ],
        use: [
          {
            loader: 'style-loader',
            options: {
              attributes: {
                id: 'demo-styles',
                nonce: '0a59a005' // @TODO needs to match a global nonce instance
              }
            }
          },
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.npm_lifecycle_event === 'build:dev:stats' ? 'server' : 'disabled',
      reportFilename: 'dev-build-report.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        // {
        //   from: './demos/**/**/*.js',
        //   to({ absoluteFilename }) {
        //     const baseName = path.basename(absoluteFilename);
        //     const folders = path.dirname(absoluteFilename).split(path.sep);
        //     const filePath = `${folders[folders.length - 1]}/${baseName}`;
        //     return filePath;
        //   }
        // },
        // {
        //   from: path.resolve(__dirname, 'demos/data/'),
        //   to: path.resolve(__dirname, `build/${isProduction ? 'production' : 'development'}/data/`)
        // },
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, `build/${isProduction ? 'production' : 'development'}/assets/`)
        },
        // {
        //   from: './demos/**/**/*.yaml',
        //   to({ absoluteFilename }) {
        //     const baseName = path.basename(absoluteFilename);
        //     const folders = path.dirname(absoluteFilename).split(path.sep);
        //     const filePath = `${folders[folders.length - 1]}/${baseName}`;
        //     return filePath;
        //   }
        // }
      ]
    }),
  ].concat(WebpackHtmlExamples)
};
