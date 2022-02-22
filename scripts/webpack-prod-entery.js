const NodeFsFiles = require('./node-fs-files');

const prodEntry = () => {
  const prodEntryObj = {}
  const entryArray = NodeFsFiles('./src', 'js')
  const entryProdFilter = entryArray.filter( (item) => !item.includes('demo') && !item.includes('scripts') )

  console.log(entryProdFilter)
}

prodEntry()
//module.exports = prodEntry

