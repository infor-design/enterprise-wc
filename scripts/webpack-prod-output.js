const NodeFsFiles = require('./node-fs-files');

const srcFileListArray = NodeFsFiles('./src', 'ts');

const prodOutput = (pathData) => {
  if (!pathData || pathData === 'runtime') return '';
  const isWin32 = process.platform === 'win32' ? '\\' : '/';
  const srcFileListFilter = srcFileListArray.filter((chunk) => chunk.includes(`${pathData}.ts`));
  const srcFileListFilterItem = srcFileListFilter[0];

  if (srcFileListFilterItem === undefined) console.log(srcFileListFilterItem, pathData);

  const srcFileListFilterItemArray = srcFileListFilterItem.split(isWin32);
  srcFileListFilterItemArray.splice(0, 1);
  srcFileListFilterItemArray.pop();
  const webpackOutputPath = srcFileListFilterItemArray.join(isWin32);

  return webpackOutputPath;
};

module.exports = prodOutput;
