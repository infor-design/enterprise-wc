const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sass = require('sass');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');
const glob = require('glob');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  entry: glob.sync('./src/components/**/index.js').reduce((acc, filePath) => {
    let entry = filePath.replace(`/${path.basename(filePath)}`, '');
    entry = entry.replace('./src/components/', '');
    acc[`${entry}/${entry}`] = filePath;
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
    ],
    runtimeChunk: 'single'
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
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    }),
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
        }
      ]
    })
  ]
};

// Make a Copy of the Sass Files only for standalone Css
if (isProduction) {
  module.exports.plugins.push(new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/components/**/*.d.ts',
        to({ absoluteFilename }) {
          const baseName = path.basename(absoluteFilename);
          if (absoluteFilename.indexOf('core') > -1) {
            return `${absoluteFilename.replace('/src/', '/dist/')}`;
          }
          return `${baseName.replace('.d.ts', '')}/${baseName}`;
        },
      },
      {
        from: './src/components/**/*.md',
        to({ absoluteFilename }) {
          const baseName = path.basename(absoluteFilename);
          const folders = path.dirname(absoluteFilename).split(path.sep);
          return `${folders[folders.length - 1]}/${baseName}`;
        }
      }
    ]
  }));
}
