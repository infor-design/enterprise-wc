import IdsTree from '../ids-tree';
import treeBasicJSON from '../../../assets/data/tree-basic.json';

document.addEventListener('DOMContentLoaded', () => {
  const treeDemo = document.querySelector('#tree-demo');

  if (treeDemo) {
    (async function init() {
      // Do an ajax request
      const res = await fetch(treeBasicJSON);
      const data = await res.json();
      treeDemo.data = data;

      // On selected
      treeDemo.addEventListener('selected', (e) => {
        console.info('selected:', e?.detail);
      });
    }());
  }
});
