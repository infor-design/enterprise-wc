const NodeFsFiles = require('./node-fs-files');

const demoEntry = () => {
  const demoEntryObj = {}
  const entryArray = NodeFsFiles('./src/components', 'js')
  const entryDemoFilter = entryArray.filter((item) => (item.includes('demo') && item.includes('index.js')));
  entryDemoFilter.forEach( (entry) => {
    const pathArray = entry.split('/');
    demoEntryObj[pathArray[2]] = `./${entry}`;
  });

  return demoEntryObj;
};

module.exports = demoEntry;