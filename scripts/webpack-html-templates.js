const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const NodeFsFiles = require('./node-fs-files');

const WebpackHtmlTemplates = NodeFsFiles(`./src/components`, 'html');
const isWin32 = process.platform === 'win32' ? '\\' : '/';
const WebpackHtmlExamples = WebpackHtmlTemplates.map((template) => {
  const chunkArray = template.split(isWin32);
  chunkArray.splice(0, 2);
  const chunkName = chunkArray[0];
  const chunkFileNameArray = template.split(isWin32);
  const chunkFileName = chunkFileNameArray.slice(-1)[0];
  const noCSP = !!chunkFileName.includes('side-by-side');
  const title = `${chunkName.split('-').map((word) => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`).join(' ').replace('Ids ', 'IDS ')}${chunkName === 'ids-demo-app' ? '' : ' Component'}`;
  let extraChunk;
  chunkFileName !== 'index.html' && fs.existsSync(`./src/components/${chunkName}/demos/${chunkFileName.replace('.html', '.ts')}`);
  chunkFileName ? extraChunk = `${chunkName}-${chunkFileName.replace('.html', '')}` : extraChunk = '';

  let chunkList = [chunkName, 'ids-container', 'ids-text', 'ids-icon', 'ids-layout-grid', 'ids-theme-switcher', noCSP ? 'ids-csp-side-by-side' : 'ids-csp', extraChunk];
  if (chunkFileName.includes('standalone-css')) {
    chunkList = [extraChunk, 'ids-csp'];
  }

  // Special Entry for Main Homepage
  if (chunkName === 'ids-demo-app') {
    chunkList.push('ids-card');
    chunkList.push('ids-block-grid');
    chunkList.push('ids-hyperlink');

    return new HTMLWebpackPlugin({
      template: `./${template}`,
      title,
      filename: `index.html`,
      chunks: chunkList,
      favicon: './src/assets/images/favicon.ico',
    });
  }

  // Normal Entry for all other demos
  return new HTMLWebpackPlugin({
    template: `./${template}`,
    title,
    filename: `${chunkName}/${chunkFileName}`,
    chunks: chunkList,
    favicon: './src/assets/images/favicon.ico',
  });
});

module.exports = WebpackHtmlExamples;
