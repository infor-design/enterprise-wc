const path = require('path');
const NodeFsFiles = require('./node-fs-files');

const demoEntry = () => {
  const demoEntryObj = {};
  const entryArray = NodeFsFiles('./src/components', 'ts');
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  const entryDemoFilter = entryArray.filter((item) => (item.includes('demo') && item.includes('.ts')));
  entryDemoFilter.forEach((entry) => {
    const pathArray = entry.split(isWin32);
    entry.includes('index.ts') ? demoEntryObj[pathArray[2]] = `./${entry}` : demoEntryObj[`${pathArray[2]}-${path.parse(entry).name}`] = `./${entry}`;
  });
  return demoEntryObj;
};

module.exports = demoEntry;
