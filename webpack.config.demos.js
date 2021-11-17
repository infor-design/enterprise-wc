const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sass = require('sass');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const glob = require('glob');
const fileUpload = require('express-fileupload');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
process.env.NODE_ENV = isProduction ? 'production' : 'development';
const demosDir = './demos';

module.exports = {
  /*
  entry: glob.sync('./demos//**.js').reduce((acc, filePath) => {
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
    console.log(acc);
    return acc;
  }, {}),
  */
  entry: {
    // Add Demo App Home Page
    example: `${demosDir}/example.js`,
    index: `${demosDir}/index.js`,
    // Dependencies for many of the examples
    'ids-container/ids-container': `${demosDir}/ids-container/index.js`,
    'ids-icon/ids-icon': `${demosDir}/ids-icon/index.js`,
    'ids-layout-grid/ids-layout-grid': `${demosDir}/ids-layout-grid/index.js`,
    'ids-text/ids-text': `${demosDir}/ids-text/index.js`,
    // About
    'ids-about/example': './demos/ids-about/example.js',
    'ids-about/ids-about': './demos/ids-about/index.js',
    'ids-about/standalone-css': './demos/ids-about/standalone-css.js',
    // Accordion
    'ids-accordion/example': `${demosDir}/ids-accordion/example.js`,
    'ids-accordion/ids-accordion': `${demosDir}/ids-accordion/index.js`,
    'ids-accordion/nested': `${demosDir}/ids-accordion/nested.js`,
    // Header
    'ids-header/ids-header': `${demosDir}/ids-header/index.js`,
    'ids-header/button-types': `${demosDir}/ids-header/button-types.js`,
    'ids-header/standalone-css': `${demosDir}/ids-header/standalone-css.js`,
    // Menu
    'ids-menu/example': `${demosDir}/ids-menu/example.js`,
    'ids-menu/ids-menu': `${demosDir}/ids-menu/index.js`,
    'ids-menu/side-by-side': `${demosDir}/ids-menu/side-by-side.js`,
    // Menu Button
    'ids-menu-button/example': `${demosDir}/ids-menu-button/example.js`,
    'ids-menu-button/ids-menu-button': `${demosDir}/ids-menu-button/index.js`,
    // Popup Menu
    'ids-popup-menu/ids-popup-menu': `${demosDir}/ids-popup-menu/index.js`,
    'ids-popup-menu/example': `${demosDir}/ids-popup-menu/example.js`,
    'ids-popup-menu/data-driven': `${demosDir}/ids-popup-menu/data-driven.js`,
    'ids-popup-menu/selected-state': `${demosDir}/ids-popup-menu/selected-state.js`,
    'ids-popup-menu/standalone-css': `${demosDir}/ids-popup-menu/standalone-css.js`,
    'ids-popup-menu/trigger-immediate': `${demosDir}/ids-popup-menu/trigger-immediate.js`,
    // Search Field
    'ids-search-field/ids-search-field': `${demosDir}/ids-search-field/index.js`,
    // Tabs
    'ids-tabs/ids-tabs': `${demosDir}/ids-tabs/index.js`,
    'ids-tabs/example': `${demosDir}/ids-tabs/example.js`,
    'ids-tabs/header-tabs': `${demosDir}/ids-tabs/header-tabs.js`,
    'ids-tabs/side-by-side': `${demosDir}/ids-tabs/side-by-side.js`,
    'ids-tabs/standalone-css': `${demosDir}/ids-tabs/standalone-css.js`,
    // Tags
    'ids-tag/ids-tag': `${demosDir}/ids-tag/index.js`,
    'ids-tag/example': `${demosDir}/ids-tag/example.js`,
    // Text
    // 'ids-text/ids-text': `${demosDir}/ids-text/index.js`,
    'ids-text/variant-alternate': `${demosDir}/ids-text/variant-alternate.js`,
    // TextArea
    'ids-textarea/ids-textarea': `${demosDir}/ids-textarea/index.js`,
    'ids-textarea/example': `${demosDir}/ids-textarea/example.js`,
    // Theme Switcher
    'ids-theme-switcher/ids-theme-switcher': `${demosDir}/ids-theme-switcher/index.js`,
    // Toast
    'ids-toast/ids-toast': `${demosDir}/ids-toast/index.js`,
    'ids-toast/example': `${demosDir}/ids-toast/example.js`,
    'ids-toast/sandbox': `${demosDir}/ids-toast/sandbox.js`,
    'ids-toast/side-by-side': `${demosDir}/ids-toast/side-by-side.js`,
    // Toggle Button
    'ids-toggle-button/ids-toggle-button': `${demosDir}/ids-toggle-button/index.js`,
    'ids-toggle-button/example': `${demosDir}/ids-toggle-button/example.js`,
    'ids-toggle-button/side-by-side': `${demosDir}/ids-toggle-button/side-by-side.js`,
    // Toolbar
    'ids-toolbar/ids-toolbar': `${demosDir}/ids-toolbar/index.js`,
    'ids-toolbar/example': `${demosDir}/ids-toolbar/example.js`,
    // Tooltip
    'ids-tooltip/ids-tooltip': `${demosDir}/ids-tree/index.js`,
    'ids-tooltip/example': `${demosDir}/ids-tooltip/example.js`,
    'ids-tooltip/performance': `${demosDir}/ids-tooltip/performance.js`,
    'ids-tooltip/sandbox': `${demosDir}/ids-tooltip/sandbox.js`,
    // Tree
    'ids-tree/ids-tree': `${demosDir}/ids-tree/index.js`,
    'ids-tree/example': `${demosDir}/ids-tree/example.js`,
    'ids-tree/sandbox': `${demosDir}/ids-tree/sandbox.js`,
    'ids-tree/side-by-side': `${demosDir}/ids-tree/side-by-side.js`,
    // Trigger Field
    'ids-trigger-field/ids-trigger-field': `${demosDir}/ids-trigger-field/index.js`,
    'ids-trigger-field/side-by-side': `${demosDir}/ids-trigger-field/side-by-side.js`,
    // Upload
    'ids-upload/ids-upload': `${demosDir}/ids-upload/index.js`,
    'ids-upload/side-by-side': `${demosDir}/ids-upload/side-by-side.js`,
    // Upload Advanced
    'ids-upload-advanced/ids-upload-advanced': `${demosDir}/ids-upload-advanced/index.js`,
    'ids-upload-advanced/example': `${demosDir}/ids-upload-advanced/example.js`,
    'ids-upload-advanced/side-by-side': `${demosDir}/ids-upload-advanced/side-by-side.js`,
    'ids-upload-advanced/test-sandbox': `${demosDir}/ids-upload-advanced/test-sandbox.js`,
    // Virtual Scroll
    'ids-virtual-scroll/ids-virtual-scroll': `${demosDir}/ids-virtual-scroll/index.js`,
    'ids-virtual-scroll/example': `${demosDir}/ids-virtual-scroll/example.js`,
    // Wizard
    'ids-wizard/ids-wizard': `${demosDir}/ids-wizard/index.js`,
  },
  devtool: isProduction ? 'cheap-module-source-map' : 'source-map', // try source-map for prod
  mode: isProduction ? 'production' : 'development',
  experiments: {
  },
  infrastructureLogging: {
    level: 'error'
  },
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
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  output: {
    chunkFormat: 'module',
    path: path.resolve(__dirname, 'demo-dist'),
    filename: '[name].js',
    clean: true,
    publicPath: '/'
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
