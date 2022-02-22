const NodeFsFiles = require('./node-fs-files');

const prodEntry = () => {
  const prodEntryObj = {};
  const entryArray = NodeFsFiles('./src', 'js');
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  const entryProdFilter = entryArray.filter( (item) => (!item.includes('demo') && !item.includes('scripts')));

  entryProdFilter.forEach((entry => {
    const pathArray = entry.split(isWin32)
    const fileName = pathArray[pathArray.length - 1]
    const chunk = fileName.split('.');
    prodEntryObj[chunk[0]] = `./${entry}`;
  }));

  return prodEntryObj;
}

module.exports = prodEntry

