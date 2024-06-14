import treeBasicJSON from '../../../assets/data/tree-basic.json';
import IdsTree from '../ids-tree';

document.addEventListener('DOMContentLoaded', () => {
  const treeElem: any = document.querySelector<IdsTree>('#tree-demo');
  const deleteAllBtn: any = document.querySelector('#delete-all');
  const setOneBtn: any = document.querySelector('#set-one');
  const resetBtn: any = document.querySelector('#reset-nodes');

  if (treeElem) {
    (async function init() {
      const res = await fetch(treeBasicJSON as any);
      const data: any = await res.json();

      treeElem.data = data;
    }());
  }

  deleteAllBtn.addEventListener('click', () => {
    console.info('deleteAll clicked');
    treeElem.data = [];
    console.info('treeData: ', treeElem.data);
  });

  setOneBtn.addEventListener('click', () => {
    console.info('setOneItem clicked');
    treeElem.data = [
      {
        id: 'home',
        text: 'Home',
      },
    ];
    console.info('treeData: ', treeElem.data);
  });

  resetBtn.addEventListener('click', async () => {
    console.info('reset');
    const res = await fetch(treeBasicJSON as any);
    const data: any = await res.json();
    treeElem.data = data;
    console.info('treeData: ', treeElem.data);
  });
});
