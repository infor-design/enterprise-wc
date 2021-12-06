/* eslint-disable quote-props */
const path = require('path');
const fs = require("fs");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

const listFiles = (dirPath, fileType, fileOptions) => {
  const files = fs.readdirSync(dirPath);
  fileOptions = fileOptions || [];
  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      fileOptions = listFiles(`${dirPath}/${file}`, fileType, fileOptions);
    } else {
      file.split('.')[1] === fileType ?  (Array.isArray(fileOptions) ? fileOptions.push(path.join(__dirname, dirPath, "/", file)) : fileOptions[path.join(file.split('.')[0])] = path.join(__dirname, dirPath, "/", file)) : ''
    }
  })
  return fileOptions
}

module.exports = {
  entry: () => listFiles('./src', 'js', {}),
  output: {
    filename: (pathData) => (pathData.chunk.name === 'enterprise-wc' ? '[name].js' : '[name]/[name].js'),
    chunkFormat: 'module',
    asyncChunks: true,
    path: path.resolve(__dirname, 'dist/enterprise-wc'),
    publicPath: '',
    clean: true
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
    })
  ],
  devtool: 'source-map',
  mode: isProduction
};
