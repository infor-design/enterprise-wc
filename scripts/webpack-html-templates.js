const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const fsFiles = require('./node-fs-files');

let htmlTemplates = fsFiles(`./src/components`, 'html');
const isWin32 = process.platform === 'win32' ? '\\' : '/';
const filterComponents = process.env.npm_config_components || '';

if (filterComponents) {
  htmlTemplates = htmlTemplates.filter((item) => item.indexOf(filterComponents) > -1 || item.indexOf('ids-container') > -1 || item.indexOf('ids-text') > -1 || item.indexOf('ids-layout-grid') > -1 || item.indexOf('ids-text') > -1);
}

const htmlExamples = htmlTemplates.map((template) => {
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

  let chunkList = [chunkName, 'ids-container', 'ids-text', 'ids-icon', 'ids-layout-grid', 'ids-theme-switcher', extraChunk];
  if (chunkFileName.includes('standalone-css')) {
    chunkList = [extraChunk];
  }

  const metaTags = {
    charset: { charset: 'utf-8' },
    viewport: {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  };

  if (!noCSP) {
    // 'unsafe-eval'is only needed because of
    // the current devtool used as a workaround.
    metaTags.csp = {
      'http-equiv': 'Content-Security-Policy',
      content: `
        script-src 'self' https://unpkg.com/ 'unsafe-eval';
        style-src 'self' 'nonce-0a59a005';
      `
    };
  }

  // Special Entry for Main Homepage
  if (chunkName === 'ids-demo-app') {
    // Special Entry for Blank Pages
    if (chunkFileName === 'blank.html' || chunkFileName === 'utils.html') {
      return new HTMLWebpackPlugin({
        template: `./${template}`,
        title,
        filename: `${chunkName}/${chunkFileName}`,
        chunks: chunkFileName === 'utils.html' ? ['ids-hyperlink', 'ids-demo-app-utils'] : [],
        favicon: './src/assets/images/favicon.ico',
        meta: metaTags,
        font: '<link href="/fonts/font-face.css" rel="stylesheet">'
      });
    }

    chunkList.push('ids-card');
    chunkList.push('ids-block-grid');
    chunkList.push('ids-hyperlink');

    return new HTMLWebpackPlugin({
      template: `./${template}`,
      title,
      filename: `index.html`,
      chunks: chunkList,
      favicon: './src/assets/images/favicon.ico',
      scriptLoading: 'module',
      meta: metaTags,
      font: '<link href="/fonts/font-face.css" rel="stylesheet">'
    });
  }

  // Special Entry for List Pages
  if (chunkFileName === 'index.html') {
    chunkList.push('ids-data-grid');
    chunkList.push(`${chunkFileNameArray[2]}-listing`);
  }

  // Normal Entry for all other demos
  return new HTMLWebpackPlugin({
    template: `./${template}`,
    title,
    filename: `${chunkName}/${chunkFileName}`,
    chunks: chunkList,
    favicon: './src/assets/images/favicon.ico',
    scriptLoading: 'module',
    meta: metaTags,
    font: '<link href="/fonts/font-face.css" rel="stylesheet">'
  });
});

// eslint-disable-next-line no-console
console.info(`${htmlExamples.length} examples`);
module.exports = htmlExamples;
