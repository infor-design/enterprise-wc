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

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  entry: glob.sync('./app/**/**.js').reduce((acc, filePath) => {
    let entry = filePath.replace(`/${path.basename(filePath)}`, '');
    entry = (entry === './app' ? 'index' : entry.replace('./app/', ''));

    if (path.basename(filePath) === 'index.js') {
      acc[entry === 'index' ? entry : `${entry}/${entry}`] = filePath;
    } else {
      acc[`${entry}/${path.basename(filePath).replace('.js', '')}`] = filePath;
    }
    return acc;
  }, {}),
  devtool: isProduction ? 'cheap-module-source-map' : 'source-map', // try source-map for prod
  mode: isProduction ? 'production' : 'development',
  performance: {
    hints: false
  },
  optimization: {
    minimize: !!isProduction,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i
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
    // For example: http://localhost:4300/api/bikes or relative as /api/bikes
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
      {
        test: /\.html$/,
        loader: 'handlebars-loader'
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
      },
      {
        test: /\.scss$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'app')
        ],
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
    // Append index "kitchen sink", rest is dynamic below
    new HTMLWebpackPlugin({
      template: 'app/index.html',
      inject: 'body',
      title: 'IDS Enterprise Web Components',
      chunks: ['index']
    }),
    // Show Style Lint Errors in the console and fail
    new StylelintPlugin({})
  ]
};

// Fix build error on prod about favicon
if (!isProduction) {
  module.exports.plugins.push(new FaviconsWebpackPlugin({
    logo: 'app/assets/favicon.ico',
    mode: 'auto'
  }));
}

// Make a Copy of the Sass Files only for standalone Css
if (isProduction) {
  module.exports.plugins.push(new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/**/*.scss',
        to({ absoluteFilename }) {
          const baseName = path.basename(absoluteFilename);
          return `${baseName.replace('.scss', '')}/${baseName.replace('scss', 'css')}`;
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
        to({ absoluteFilename }) {
          const baseName = path.basename(absoluteFilename);
          if (absoluteFilename.indexOf('ids-base') > -1) {
            return `${absoluteFilename.replace('/src/', '/dist/')}`;
          }
          return `${baseName.replace('.d.ts', '')}/${baseName}`;
        },
      }
    ]
  }));
}

// Dynamically add all html examples
glob.sync('./app/**/*.html').reduce((acc, filePath) => {
  const folderName = path.dirname(filePath).replace('./app/', '');
  let folderAndFile = filePath.replace('./app/', '');
  let title = `${folderName.split('-').map((word) =>
    `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
    .join(' ')} ${folderAndFile.indexOf('standalone-css') > -1 ? 'Standalone Css' : 'Component'}`;

  // Add a title to the component page
  title = title.replace('Ids', 'IDS');

  // Adjust the folder paths for layouts
  if (folderName === 'layouts' || folderAndFile.indexOf('example.html') > -1 || folderAndFile === 'index.html') {
    return folderName;
  }

  // Figure out the chunks to use
  if (folderAndFile.indexOf('index.html') === -1) {
    folderAndFile = folderAndFile.replace('.html', '');
  }

  let chunk = `${folderName}/${folderName}`;
  const jsFile = path.basename(filePath).replace('.html', '.js');
  if (jsFile !== 'index.js' && fs.existsSync(filePath.replace('.html', '.js'))) {
    chunk = `${folderName}/${jsFile.replace('.js', '')}`;
  }

  const folderChunks = [chunk, 'ids-icon/ids-icon', 'ids-text/ids-text', 'ids-layout-grid/ids-layout-grid'];

  // Add example.js to the page as a separate chunk
  const demoFile = filePath.replace('index.html', 'example.js');
  if (jsFile === 'index.js' && fs.existsSync(demoFile)) {
    folderChunks.push(`${folderName}/example`);
  }
  // Create the entry
  module.exports.plugins.push(
    new HTMLWebpackPlugin({
      template: filePath,
      inject: 'body',
      filename: folderAndFile,
      title,
      chunksSortMode: 'manual',
      chunks: jsFile === 'standalone-css.js'
        ? []
        : folderChunks
    }),
  );
  return folderName;
}, {});
