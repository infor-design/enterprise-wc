const path = require('path');
const sass = require('sass');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const demoEntry = require('./scripts/webpack-dev-entry');
const handleUpload = require('./scripts/handle-upload');
const htmlExamples = require('./scripts/webpack-html-templates');

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
  devtool: 'eval-source-map', // cheap-module-source-map -> original eval-cheap-module-source-map -> works but has csp errors
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
          from: './src/components/ids-locale/data/*.ts',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath
              .replace('ids-locale/data/', 'locale-data/')
              .replace('ts', 'js');
            return filePath;
          }
        },
        {
          from: './src/themes/**/*.scss',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            return `themes/${baseName.replace('scss', 'css')}`;
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
      ]
    }),
  ].concat(htmlExamples)
};
