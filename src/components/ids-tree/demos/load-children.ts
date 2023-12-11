import treeJSON from '../../../assets/data/tree-load-children.json';
import type IdsTree from '../ids-tree';

document.addEventListener('DOMContentLoaded', () => {
  const treeDemo: IdsTree = document.querySelector<IdsTree>('#tree-children-demo')!;

  if (treeDemo) {
    (async function init() {
      // Do an ajax request
      const res = await fetch(treeJSON as any);
      const data: any = await res.json();
      treeDemo.data = data;

      treeDemo.beforeExpanded = async function beforeShow() {
        const url: any = treeJSON;
        const res2 = await fetch(url);
        const data2 = await res2.json();

        // Reuse the same API but change the data
        data2[0].text = `New Dynamic Node`;
        delete data2[0].children;

        // Takes an array
        return [data2[0]];
      };

      treeDemo.afterExpanded = async function beforeShow() {
        console.info('after expand node fired');
      };
    }());
  }
});
