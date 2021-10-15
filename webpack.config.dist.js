const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sass = require('sass');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const glob = require('glob');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  entry: glob.sync('./src/**/**/ids*.js',).reduce((acc, filePath) => {
    acc[filePath.replace('./src', '').replace('.js', '')] = filePath;
    return acc;
  }, {}),
  devtool: isProduction ? 'cheap-module-source-map' : 'source-map', // try source-map for prod
  mode: isProduction ? 'production' : 'development',
  performance: {
    hints: false
  },
  cache: {
    type: 'filesystem',
    version: '0.0.0'
  },
  optimization: {
    minimize: !!isProduction,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i
      }),
    ]
  },
  output: {
    library: '[name]-lib.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
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
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'demos')
        ],
        use: [
          'sass-to-string',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed',
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
            loader: 'style-loader'
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `./build-report/index-${isProduction ? 'prod' : 'dev'}.html`
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/components/**/*.scss',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            return `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName.replace('scss', 'css')}`;
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
          from: './src/**/**/index.js',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/', '');
            return filePath;
          }
        },
        {
          from: './src/**/**/*.d.ts',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/', '');
            return filePath;
          }
        },
        {
          from: './src/**/**/*.md',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 2]}/${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/', '');
            return filePath;
          }
        }
      ]
    })
  ]
};
