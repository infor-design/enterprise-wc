const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
const componentsDir = './src/components';

module.exports = {
  entry: {
    'enterprise-wc': `${componentsDir}/enterprise-wc.js`,
    about: { import: [`${componentsDir}/ids-about/ids-about.js`] },
    accordion: { import: [`${componentsDir}/ids-accordion/ids-accordion.js`] },
    'action-sheet': { import: [`${componentsDir}/ids-action-sheet/ids-action-sheet.js`] },
    alert: { import: [`${componentsDir}/ids-alert/ids-alert.js`] },
    'app-menu': { import: [`${componentsDir}/ids-app-menu/ids-app-menu.js`] },
    badge: { import: [`${componentsDir}/ids-badge/ids-badge.js`] },
    'block-grid': { import: [`${componentsDir}/ids-block-grid/ids-block-grid.js`] },
    breadcrumb: { import: [`${componentsDir}/ids-breadcrumb/ids-breadcrumb.js`] },
    button: { import: [`${componentsDir}/ids-button/ids-button.js`] },
    card: { import: [`${componentsDir}/ids-card/ids-card.js`] },
    checkbox: { import: [`${componentsDir}/ids-checkbox/ids-checkbox.js`] },
    color: { import: [`${componentsDir}/ids-color/ids-color.js`] },
    'color-picker': { import: [`${componentsDir}/ids-color-picker/ids-color-picker.js`] },
    container: { import: [`${componentsDir}/ids-container/ids-container.js`] },
    'contextual-action-panel': { import: [`${componentsDir}/ids-contextual-action-panel/ids-contextual-action-panel.js`] },
    counts: { import: [`${componentsDir}/ids-counts/ids-counts.js`] },
    'data-grid': { import: [`${componentsDir}/ids-data-grid/ids-data-grid.js`] },
    draggable: { import: [`${componentsDir}/ids-draggable/ids-draggable.js`] },
    drawer: { import: [`${componentsDir}/ids-drawer/ids-drawer.js`] },
    dropdown: { import: [`${componentsDir}/ids-dropdown/ids-dropdown.js`] },
    'expandable-area': { import: [`${componentsDir}/ids-expandable-area/ids-expandable-area.js`] },
    fieldset: { import: [`${componentsDir}/ids-fieldset/ids-fieldset.js`] },
    header: { import: [`${componentsDir}/ids-header/ids-header.js`] },
    hidden: { import: [`${componentsDir}/ids-hidden/ids-hidden.js`] },
    hierarchy: { import: [`${componentsDir}/ids-hierarchy/ids-hierarchy.js`] },
    'home-page': { import: [`${componentsDir}/ids-home-page/ids-home-page.js`] },
    hyperlink: { import: [`${componentsDir}/ids-hyperlink/ids-hyperlink.js`] },
    icon: { import: [`${componentsDir}/ids-icon/ids-icon.js`] },
    image: { import: [`${componentsDir}/ids-image/ids-image.js`] },
    input: { import: [`${componentsDir}/ids-input/ids-input.js`] },
    'layout-grid': { import: [`${componentsDir}/ids-layout-grid/ids-layout-grid.js`] },
    'list-box': { import: [`${componentsDir}/ids-list-box/ids-list-box.js`] },
    'list-builder': { import: [`${componentsDir}/ids-list-builder/ids-list-builder.js`] },
    'list-view': { import: [`${componentsDir}/ids-list-view/ids-list-view.js`] },
    'loading-indicator': { import: [`${componentsDir}/ids-loading-indicator/ids-loading-indicator.js`] },
    locale: { import: [`${componentsDir}/ids-locale/ids-locale.js`] },
    mask: { import: [`${componentsDir}/ids-mask/ids-masks.js`] },
    menu: { import: [`${componentsDir}/ids-menu/ids-menu.js`] },
    'menu-button': { import: [`${componentsDir}/ids-menu-button/ids-menu-button.js`] },
    message: { import: [`${componentsDir}/ids-message/ids-message.js`] },
    modal: { import: [`${componentsDir}/ids-modal/ids-modal.js`] },
    'modal-button': { import: [`${componentsDir}/ids-modal-button/ids-modal-button.js`] },
    'notification-banner': { import: [`${componentsDir}/ids-notification-banner/ids-notification-banner.js`] },
    pager: { import: [`${componentsDir}/ids-pager/ids-pager.js`] },
    popup: { import: [`${componentsDir}/ids-popup/ids-popup.js`] },
    'popup-menu': { import: [`${componentsDir}/ids-popup-menu/ids-popup-menu.js`] },
    'process-indicator': { import: [`${componentsDir}/ids-process-indicator/ids-process-indicator.js`] },
    'progress-bar': { import: [`${componentsDir}/ids-progress-bar/ids-progress-bar.js`] },
    'progress-chart': { import: [`${componentsDir}/ids-progress-chart/ids-progress-chart.js`] },
    radio: { import: [`${componentsDir}/ids-radio/ids-radio.js`] },
    rating: { import: [`${componentsDir}/ids-rating/ids-rating.js`] },
    'render-loop': { import: [`${componentsDir}/ids-render-loop/ids-render-loop.js`] },
    'scroll-view': { import: [`${componentsDir}/ids-scroll-view/ids-scroll-view.js`] },
    'search-field': { import: [`${componentsDir}/ids-search-field/ids-search-field.js`] },
    separator: { import: [`${componentsDir}/ids-separator/ids-separator.js`] },
    'skip-link': { import: [`${componentsDir}/ids-skip-link/ids-skip-link.js`] },
    slider: { import: [`${componentsDir}/ids-slider/ids-slider.js`] },
    spinbox: { import: [`${componentsDir}/ids-spinbox/ids-spinbox.js`] },
    splitter: { import: [`${componentsDir}/ids-splitter/ids-splitter.js`] },
    'step-chart': { import: [`${componentsDir}/ids-step-chart/ids-step-chart.js`] },
    'summary-field': { import: [`${componentsDir}/ids-summary-field/ids-summary-field.js`] },
    'swipe-action': { import: [`${componentsDir}/ids-swipe-action/ids-swipe-action.js`] },
    switch: { import: [`${componentsDir}/ids-switch/ids-switch.js`] },
    tabs: { import: [`${componentsDir}/ids-tabs/ids-tabs.js`] },
    tag: { import: [`${componentsDir}/ids-tag/ids-tag.js`] },
    text: { import: [`${componentsDir}/ids-text/ids-text.js`] },
    textarea: { import: [`${componentsDir}/ids-textarea/ids-textarea.js`] },
    'theme-switcher': { import: [`${componentsDir}/ids-theme-switcher/ids-theme-switcher.js`] },
    toast: { import: [`${componentsDir}/ids-toast/ids-toast.js`] },
    'toggle-button': { import: [`${componentsDir}/ids-toggle-button/ids-toggle-button.js`] },
    toolbar: { import: [`${componentsDir}/ids-toolbar/ids-toolbar.js`] },
    tooltip: { import: [`${componentsDir}/ids-tooltip/ids-tooltip.js`] },
    tree: { import: [`${componentsDir}/ids-tree/ids-tree.js`] },
    'trigger-field': { import: [`${componentsDir}/ids-trigger-field/ids-trigger-field.js`] },
    upload: { import: [`${componentsDir}/ids-upload/ids-upload.js`] },
    'upload-advanced': { import: [`${componentsDir}/ids-upload-advanced/ids-upload-advanced.js`] },
    'virtual-scroll': { import: [`${componentsDir}/ids-virtual-scroll/ids-virtual-scroll.js`] },
    wizard: { import: [`${componentsDir}/ids-wizard/ids-wizard.js`] },
  },
  output: {
    filename: (pathData) => (pathData.chunk.name === 'enterprise-wc' ? '[name].js' : 'ids-[name]/ids-[name].js'),
    chunkFormat: 'module',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: 'auto',
    clean: true
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all'
    },
  },
  performance: {
    hints: false
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
      filename: 'ids-[name]/ids-[name].css'
    })
  ],
  devtool: 'source-map',
  mode: isProduction ? 'production' : 'development'
};
