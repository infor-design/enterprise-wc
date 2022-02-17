import IdsTree from '../ids-tree';

document.addEventListener('DOMContentLoaded', () => {
  const treeDemo = document.querySelector('#tree-demo');

  if (treeDemo) {
    (async function init() {
      // Do an ajax request
      const url = '/data/tree-basic.json';

      const res = await fetch(url);
      const data = await res.json();
      treeDemo.data = data;

      // On selected
      treeDemo.addEventListener('selected', (e) => {
        console.info('selected:', e?.detail);
      });
    }());
  }
});
