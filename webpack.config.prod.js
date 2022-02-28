const path = require('path');
const sass = require('sass');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const prodEntry = require('./scripts/webpack-prod-entry');
const prodOutput = require('./scripts/webpack-prod-output');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
process.env.NODE_ENV = isProduction ? 'production' : 'development';

module.exports = {
  entry: () => prodEntry(),
  output: {
    filename: (pathData) => (pathData.chunk.name === 'enterprise-wc' ? '[name].js' : `${prodOutput(pathData.chunk.name)}/[name].js`),
    chunkFormat: 'module',
    asyncChunks: true,
    path: path.resolve(__dirname, `build/dist/${isProduction ? 'production' : 'development'}`),
    publicPath: '',
    clean: true
  },
  infrastructureLogging: {
    level: 'error' // or 'verbose' if any debug info is needed
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 3 * 1024 // 3kb
          }
        }
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
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.npm_lifecycle_event === 'build:stats' ? 'server' : 'disabled',
      reportFilename: 'prod-build-report.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/[name].css'
    }),
    // Copy the standalone css and d.ts files to the output directory
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/components/**/*.scss',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            return `${folders[folders.length - 1]}/${baseName.replace('scss', 'css')}`;
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
          from: './src/**/**/*.d.ts',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/components/', '');

            if (filePath.includes('core/')) {
              filePath = filePath.replace('core/', '').replace('.d.ts', '');
              return `${filePath}/${filePath}.d.ts`;
            }
            return filePath;
          }
        },
        {
          from: './src/components/**/README.md',
          to({ absoluteFilename }) {
            const baseName = path.basename(absoluteFilename);
            const folders = path.dirname(absoluteFilename).split(path.sep);
            let filePath = `${folders[folders.length - 1]}/${baseName}`;
            filePath = filePath.replace('src/components/', '');
            return filePath;
          }
        }
      ]
    })
  ],
  devtool: 'source-map',
  mode: isProduction ? 'production' : 'development',
};
