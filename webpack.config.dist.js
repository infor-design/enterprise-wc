const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

const componentsDir = './src/components';

module.exports = {
  entry: {
    'enterprise-wc': `${componentsDir}/enterprise-wc.js`,
    'ids-accordion': `${componentsDir}/ids-accordion/ids-accordion.js`,
    'ids-alert': `${componentsDir}/ids-alert/ids-alert.js`,
    'ids-app-menu': `${componentsDir}/ids-app-menu/ids-app-menu.js`,
    'ids-badge': `${componentsDir}/ids-badge/ids-badge.js`,
    'ids-block-grid': `${componentsDir}/ids-block-grid/ids-block-grid.js`,
    'ids-breadcrumb': `${componentsDir}/ids-breadcrumb/ids-breadcrumb.js`,
    'ids-button': `${componentsDir}/ids-button/ids-button.js`,
    'ids-card': `${componentsDir}/ids-card/ids-card.js`,
    'ids-checkbox': `${componentsDir}/ids-checkbox/ids-checkbox.js`,
    'ids-color': `${componentsDir}/ids-color/ids-color.js`,
    // 'ids-color-picker': `${componentsDir}/ids-color-picker/ids-color-picker.js`,
    'ids-container': `${componentsDir}/ids-container/ids-container.js`,
    'ids-counts': `${componentsDir}/ids-counts/ids-counts.js`,
    'ids-data-grid': `${componentsDir}/ids-data-grid/ids-data-grid.js`,
    'ids-draggable': `${componentsDir}/ids-draggable/ids-draggable.js`,
    'ids-drawer': `${componentsDir}/ids-drawer/ids-drawer.js`,
    'ids-icon': `${componentsDir}/ids-icon/ids-icon.js`,
    'ids-layout-grid': `${componentsDir}/ids-layout-grid/ids-layout-grid.js`,
    'ids-rating': `${componentsDir}/ids-rating/ids-rating.js`,
    'ids-tag': `${componentsDir}/ids-tag/ids-tag.js`,
    'ids-text': `${componentsDir}/ids-text/ids-text.js`
  },
  output: {
    filename: (pathData) => (pathData.chunk.name === 'enterprise-wc' ? '[name].js' : '[name]/[name].js'),
    chunkFormat: 'module',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: 'auto',
    clean: true
  },
  optimization: {
    usedExports: true,
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
        exclude: '/node_modules/',
        use: {
          // Options are all in babel.config.js
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.npm_lifecycle_event === 'build:prod:stats' ? 'server' : 'disabled', // options: server | static | json | disabled
      reportFilename: 'prod-build-report.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/[name].css'
    })
  ],
  devtool: 'source-map',
  mode: isProduction ? 'production' : 'development'
};
