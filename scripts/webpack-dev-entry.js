const path = require('path');
const fsFiles = require('./node-fs-files');

const demoEntry = () => {
  const demoEntryObj = {};
  const entryArray = fsFiles('./src/components', 'ts');
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  let entryDemoFilter = entryArray.filter((item) => (item.includes('demo') && item.includes('.ts')));
  const filterComponents = process.env.npm_config_components || '';

  if (filterComponents) {
    entryDemoFilter = entryDemoFilter.filter((item) => item.indexOf(filterComponents) > -1 || item.indexOf('ids-container') > -1 || item.indexOf('ids-text') > -1 || item.indexOf('ids-layout-grid') > -1 || item.indexOf('ids-text') > -1 || item.indexOf('ids-theme-switcher') > -1);
  }
  entryDemoFilter.forEach((entry) => {
    const pathArray = entry.split(isWin32);
    entry.includes('index.ts') ? demoEntryObj[pathArray[2]] = `./${entry}` : demoEntryObj[`${pathArray[2]}-${path.parse(entry).name}`] = `./${entry}`;
  });

  return demoEntryObj;
};
module.exports = demoEntry;
