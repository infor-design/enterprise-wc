const path = require('path');
const fs = require('fs');
const sass = require('sass');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
process.env.NODE_ENV = isProduction ? 'production' : 'development';

const listFiles = (dirPath, fileType, fileOptions) => {
  const files = fs.readdirSync(dirPath);
  fileOptions = fileOptions || [];
  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      fileOptions = listFiles(`${dirPath}/${file}`, fileType, fileOptions);
    } else {
      // eslint-disable-next-line
      file.split('.')[1] === fileType ? (Array.isArray(fileOptions) ? fileOptions.push(path.join(__dirname, dirPath, '/', file)) : fileOptions[path.join(file.split('.')[0])] = path.join(__dirname, dirPath, '/', file)) : '';
    }
  });
  return fileOptions;
};

module.exports = {
  entry: () => listFiles('./src/components', 'js', {}),
  output: {
    filename: (pathData) => (pathData.chunk.name === 'enterprise-wc' ? '[name].js' : '[name]/[name].js'),
    chunkFormat: 'module',
    asyncChunks: true,
    path: path.resolve(__dirname, 'dist'),
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
            return filePath;
          }
        },
        {
          from: './src/**/**/*.md',
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
