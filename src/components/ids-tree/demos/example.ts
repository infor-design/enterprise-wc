import treeBasicJSON from '../../../assets/data/tree-basic.json';
import treeBadgeJSON from '../../../assets/data/tree-badges.json';
import IdsTree from '../ids-tree';

document.addEventListener('DOMContentLoaded', async () => {
  const treeDemo: any = document.querySelector<IdsTree>('#tree-demo');
  const badgeTree = document.querySelector<IdsTree>('#tree-badge');
  const checkbox = document.querySelector('ids-checkbox');

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

      treeDemo.addEventListener('beforeselected', (e: any) => {
        e.detail.response(!(checkbox as any).checked);
      });

      treeDemo.addEventListener('beforeunselected', (e: any) => {
        e.detail.response(!(checkbox as any).checked);
      });

      treeDemo.addEventListener('beforeexpanded', (e: any) => {
        e.detail.response(!(checkbox as any).checked);
      });

      treeDemo.addEventListener('beforecollapsed', (e: any) => {
        e.detail.response(!(checkbox as any).checked);
      });
    }());
  }

  if (badgeTree) {
    const badgeRes = await fetch(treeBadgeJSON as any);
    badgeTree.data = await badgeRes.json();
  }
});
