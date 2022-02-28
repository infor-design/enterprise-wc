const NodeFsFiles = require('./node-fs-files');

const prodOutput = (pathData) => {
  const srcFileListArray = NodeFsFiles('./src', 'js')
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  const srcFileListFilter = srcFileListArray.filter( chunk => chunk.includes(`${pathData}.js`))
  const srcFileListFilterItem = srcFileListFilter[0]
  const srcFileListFilterItemArray = srcFileListFilterItem.split(isWin32)
  srcFileListFilterItemArray.splice(0, 2)
  srcFileListFilterItemArray.pop()
  const srcFileListFilterItemArrayJoin = srcFileListFilterItemArray.join(isWin32)
  console.log(srcFileListFilterItemArrayJoin)
  return srcFileListFilterItemArrayJoin

};

module.exports = prodOutput;