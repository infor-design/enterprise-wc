const NodeFsFiles = require('./node-fs-files');

const demoEntry = () => {
  const demoEntryObj = {};
  const entryArray = NodeFsFiles('./src/components', 'js');
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  const entryDemoFilter = entryArray.filter((item) => (item.includes('demo') && item.includes('index.js')));
  entryDemoFilter.forEach((entry) => {
    const pathArray = entry.split(isWin32);
    demoEntryObj[pathArray[2]] = `./${entry}`;
  });

  return demoEntryObj;
};

module.exports = demoEntry;
