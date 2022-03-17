const fs = require('fs')
const NodeFsFiles = require('./node-fs-files');

const ChangeFileType = (folder = './', from = 'txt', to = 'txt') => {
  const fileList = NodeFsFiles(folder, from)
  fileList.forEach( fileItem => {
    const fileItemArray = fileItem.split('.')
    fs.renameSync(`..${fileItemArray[2]}.${from}`, `..${fileItemArray[2]}.${to}`);
  })
}

// Uncomment to use.
// ChangeFileType('../src/components/ids-block-grid', 'js', 'ts')

