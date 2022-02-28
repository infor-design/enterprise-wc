const NodeFsFiles = require('./node-fs-files');

const prodOutput = (pathData) => {

  const srcFileListArray = NodeFsFiles('./src', 'js')

  const sampleFilter = srcFileListArray.filter( chunk => chunk.includes(`${pathData}.js`))

  console.log(sampleFilter)

};

module.exports = prodOutput;