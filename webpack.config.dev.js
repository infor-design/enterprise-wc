const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const demoEntry = require('./scripts/webpack-dev-entry');
const handleUpload = require('./scripts/handle-upload');
const WebpackHtmlExamples = require('./scripts/webpack-html-templates');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  entry: demoEntry(),
  output: {
    path: path.resolve(__dirname, './build/development'),
    filename: '[name]/[name].js',
    assetModuleFilename: '[path][name][ext]',
    clean: true,
    publicPath: '/'
  },
  mode: isProduction ? 'production' : 'development',
  optimization: {
    splitChunks: {
      chunks: 'all'
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
      writeToDisk: true,
    },
    static: {
      directory: path.resolve(__dirname, `./build/demos/${isProduction ? 'production' : 'development'}`),
      watch: false
    },
    // For fake file upload behavior
    setupMiddlewares: handleUpload
  },
  devtool: 'cheap-module-source-map', // cheap-module-source-map -> original; eval-cheap-module-source-map -> works
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              format: 'esm',
              target: 'es2022'
            },
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/components/ids-locale/cultures/*.ts',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/components', '').replace('ts', 'js');
            return filePath;
          }
        }
      ]
    }),
    new BundleAnalyzerPlugin(
      {
        analyzerMode: process.env.npm_lifecycle_event === 'build:dev:stats' ? 'server' : 'disabled',
        reportFilename: 'dev-build-report.html'
      }
    )
  ].concat(WebpackHtmlExamples)
};
