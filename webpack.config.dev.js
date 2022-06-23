const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const demoEntry = require('./scripts/webpack-dev-entry');
const handleUpload = require('./scripts/handle-upload');
const WebpackHtmlExamples = require('./scripts/webpack-html-templates');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  entry: demoEntry(),
  output: {
    chunkFormat: 'module',
    path: path.resolve(__dirname, './build/development'),
    filename: '[name]/[name].js',
    assetModuleFilename: '[path][name][ext]',
    clean: true,
    publicPath: '/'
  },
  mode: isProduction ? 'production' : 'development',
  optimization: {
    splitChunks: {
      chunks: 'async'
    },
  },
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['node_modules']
  },
  infrastructureLogging: {
    level: 'error' // 'error' is minimal or 'verbose' if more info is needed
  },
  watchOptions: {
    aggregateTimeout: 2000,
    poll: 2000
  },
  devServer: {
    hot: false,
    liveReload: false,
    port: 4300,
    devMiddleware: {
      writeToDisk: false,
    },
    static: {
      directory: path.resolve(__dirname, `./build/demos/${isProduction ? 'production' : 'development'}`),
      watch: false
    },
    // For fake file upload behavior
    setupMiddlewares: handleUpload
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            }
          }
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.(png|jpe?g|gif|svg|json|css|pdf|csv|xml)$/i,
        exclude: [/node_modules/],
        type: 'asset/resource',
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
            options: {
              sassOptions: {
                outputStyle: 'expanded'
              }
            }
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
            loader: MiniCssExtractPlugin.loader,
            options: {
              attributes: {
                nonce: '0a59a005' // @TODO needs to match a global nonce instance
              }
            }
          },
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader'
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.npm_lifecycle_event === 'build:dev:stats' ? 'server' : 'disabled',
      reportFilename: 'dev-build-report.html'
    })
  ].concat(WebpackHtmlExamples)
};
