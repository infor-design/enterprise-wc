const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sass = require('node-sass');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const glob = require('glob');

const isProduction = false;

module.exports = {
  entry: glob.sync('./app/**/index.js').reduce((acc, filePath) => {
    let entry = filePath.replace('/index.js', '');
    entry = (entry === './app' ? 'index' : entry.replace('./app/', ''));

    acc[entry === 'index' ? entry : `${entry}/${entry}`] = filePath;
    return acc;
  }, {}),
  devtool: isProduction ? 'source-map' : 'cheap-source-map', // try source-map for prod
  mode: isProduction ? 'production' : 'development',
  optimization: {
    minimize: !!isProduction,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        sourceMap: true
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
  // Configure the dev server (node) with settings
  devServer: {
    port: 4300,
    writeToDisk: true,
    contentBase: path.resolve(__dirname, 'dist'),
    // Server the files in app/data as a JSON "API"
    // For example: http://localhost:4300/api/bikes
    before: (app) => {
      app.get('/api/:fileName', (req, res) => {
        const { fileName } = req.params;
        const json = fs.readFileSync(`./app/data/${fileName}.json`, 'utf8');
        res.json(JSON.parse(json));
      });
    },
  },
  module: {
    rules: [
      { test: /\.html$/, loader: 'handlebars-loader' },
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
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      }
    }),
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
    // Show Style Lint Errors in the console and fail
    new StylelintPlugin({}),
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
    })
  ]
};

// Fix build error on prod about favicon
if (!isProduction) {
  module.exports.plugins.push(new FaviconsWebpackPlugin('app/assets/favicon.ico'));
}

// Dynamically add all html examples
glob.sync('./app/**/*.html').reduce((acc, filePath) => {
  const folderName = path.dirname(filePath).replace('./app/', '');
  const folderAndFile = filePath.replace('./app/', '');
  let title = `${folderName.split('-').map((word) =>
    `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
    .join(' ')} Component`;

  title = title.replace('Ids', 'IDS');

  if (folderName === 'layouts' || folderAndFile.indexOf('example.html') > -1 || folderAndFile === 'index.html') {
    return folderName;
  }

  module.exports.plugins.push(
    new HTMLWebpackPlugin({
      template: filePath,
      inject: 'body',
      filename: folderAndFile,
      title,
      chunks: [`${folderName}/${folderName}`, 'ids-icon/ids-icon', 'ids-label/ids-label', 'ids-layout-grid/ids-layout-grid']
    }),
  );
  return folderName;
}, {});
