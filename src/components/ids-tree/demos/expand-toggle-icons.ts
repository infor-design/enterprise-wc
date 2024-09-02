import treeBasicJSON from '../../../assets/data/tree-basic-icons.json';

document.addEventListener('DOMContentLoaded', () => {
  const treeDemo: any = document.querySelector('#tree-demo');

  if (treeDemo) {
    (async function init() {
      // Do an ajax request
      const res = await fetch(treeBasicJSON as any);
      const data: any = await res.json();
      treeDemo.data = data;

      // On selected
      treeDemo.addEventListener('selected', (e: any) => {
        console.info('selected:', e?.detail);
      });
    }());
  }
});
