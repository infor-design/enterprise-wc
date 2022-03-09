const NodeFsFiles = require('./node-fs-files');

const prodOutput = (pathData) => {
  const srcFileListArray = NodeFsFiles('./src', 'js');
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  const srcFileListFilter = srcFileListArray.filter((chunk) => chunk.includes(`${pathData}.js`));
  const srcFileListFilterItem = srcFileListFilter[0];
  const srcFileListFilterItemArray = srcFileListFilterItem.split(isWin32);
  const isCore = srcFileListFilterItemArray[1] === 'core' ? 1 : 2;
  srcFileListFilterItemArray.splice(0, isCore);
  srcFileListFilterItemArray.pop();
  const webpackOutputPath = srcFileListFilterItemArray.join(isWin32);
  return webpackOutputPath;
};

module.exports = prodOutput;
