const path = require('path');
const NodeFsFiles = require('./node-fs-files');

const demoEntry = () => {
  const demoEntryObj = {};
  const entryArray = NodeFsFiles('./src/components', 'js');
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  const entryDemoFilter = entryArray.filter((item) => (item.includes('demo') && item.includes('.js')));
  entryDemoFilter.forEach((entry) => {
    const pathArray = entry.split(isWin32);

    // Add entry for demo app pages and index
    if (entry.includes('index.js')) {
      demoEntryObj[pathArray[2]] = `./${entry}`;
    } else {
      demoEntryObj[`${pathArray[2]}-${path.parse(entry).name}`] = `./${entry}`;
    }
  });
  return demoEntryObj;
};

module.exports = demoEntry;
