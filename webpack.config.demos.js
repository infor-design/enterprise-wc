const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const sass = require('sass');

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const glob = require('glob');
const fileUpload = require('express-fileupload');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

module.exports = {
  entry: glob.sync('./demos/**/**.js').reduce((acc, filePath) => {
    let entry = filePath.replace(`/${path.basename(filePath)}`, '');
    entry = (entry === './demos' ? 'index' : entry.replace('./demos/', ''));

    if (path.basename(filePath) === 'index.js') {
      acc[entry === 'index' ? entry : `${entry}/${entry}`] = filePath;
    } else {
      acc[`${entry}/${path.basename(filePath).replace('.js', '')}`] = filePath;
    }

    // Add kitchen sink example js
    if (acc.index) {
      acc.example = './demos/example.js';
    }
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
    splitChunks: {
      chunks: 'all',
      minSize: 3000
    }
  },
  output: {
    library: '[name]-lib.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.resolve(__dirname, 'demo-dist'),
    filename: '[name].js'
  },
  // Configure the dev server (node) with settings
  devServer: {
    hot: false,
    liveReload: false,
    port: 4300,
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: path.resolve(__dirname, 'demo-dist'),
    },
    onBeforeSetupMiddleware: (devServer) => {
      // Post method, upload files to `/tmp` folder
      // After one minute, all files will get removed
      devServer.app.use(fileUpload({ debug: false }));
      devServer.app.post('/upload', async (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
          res.status(400).send('No files were uploaded.');
          return;
        }
        const dir = `${__dirname}/tmp/`;
        // Create directory if doesn't exist
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        const paramName = `${req.headers['param-name'] || 'myfile'}[]`;
        const filesUploaded = req.files[paramName];
        let filesToUpload = [];
        if (Array.isArray(filesUploaded)) {
          filesToUpload = filesUploaded;
        } else {
          filesToUpload.push(filesUploaded);
        }
        for (let i = 0; i < filesToUpload.length; i++) {
          filesToUpload[i].mv(`${dir}${filesToUpload[i].name}`, (err) => {
            if (err) res.status(500).send(err);
          });
        }

        // Clean directory after done!, (0) No delay, (60 * 1000) One minute
        const delay = 0;
        setTimeout(() => {
          fs.readdir(dir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
              fs.unlink(path.join(dir, file), (error) => {
                if (error) throw error;
              });
            }
          });
        }, delay);

        // Complete
        res.send('Uploaded successfully!');
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
        test: /\.yaml$/,
        type: 'json',
        use: 'yaml-loader'
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // options: server | static | json | disabled
      openAnalyzer: false
    }),
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
      template: 'demos/index.html',
      inject: 'body',
      minify: false,
      title: 'IDS Enterprise Web Components',
      chunks: ['index', 'example']
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
        },
        {
          from: path.resolve(__dirname, 'demos/data/'),
          to: path.resolve(__dirname, 'demo-dist/data/')
        },
        {
          from: path.resolve(__dirname, 'demos/assets/'),
          to: path.resolve(__dirname, 'demo-dist/assets/')
        }
      ]
    })
  ]
};

// Fix build error on prod about favicon
if (!isProduction) {
  module.exports.plugins.push(new FaviconsWebpackPlugin({
    logo: 'demos/assets/favicon.ico',
    mode: 'auto'
  }));
}

// Dynamically add all html examples
glob.sync('./demos/**/*.html').reduce((acc, filePath) => {
  const folderName = path.dirname(filePath).replace('./demos/', '');
  const folderAndFile = filePath.replace('./demos/', '');
  let title = `${folderName.split('-').map((word) =>
    `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
    .join(' ')} ${folderAndFile.indexOf('standalone-css') > -1 ? 'Standalone Css' : 'Component'}`;

  // Add a title to the component page
  title = title.replace('Ids', 'IDS');

  // Adjust the folder paths for layouts
  if (folderName === 'layouts' || folderAndFile.indexOf('example.html') > -1 || folderAndFile === 'index.html') {
    return folderName;
  }

  let chunk = `${folderName}/${folderName}`;
  const jsFile = path.basename(filePath).replace('.html', '.js');
  if (jsFile !== 'index.js' && fs.existsSync(filePath.replace('.html', '.js'))) {
    chunk = `${folderName}/${jsFile.replace('.js', '')}`;
  }

  // The specified chunk is added to a list of components that will be pre-loaded,
  // no matter which page is displayed.
  const folderChunks = [
    chunk,
    'ids-container/ids-container',
    'ids-icon/ids-icon',
    'ids-layout-grid/ids-layout-grid',
    'ids-text/ids-text',
    'ids-theme-switcher/ids-theme-switcher',
    'ids-toolbar/ids-toolbar'
  ];

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
      minify: false,
      chunksSortMode: 'manual',
      chunks: jsFile === 'standalone-css.js'
        ? [chunk]
        : folderChunks
    }),
  );

  return folderName;
}, {});
