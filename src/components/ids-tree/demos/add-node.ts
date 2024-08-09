import '../../ids-menu-button/ids-menu-button';
import treeBasicJSON from '../../../assets/data/tree-basic.json';
import IdsTree, { IdsTreeData } from '../ids-tree';

document.addEventListener('DOMContentLoaded', () => {
  const treeElem = document.querySelector<IdsTree>('#tree-demo');

  if (treeElem) {
    (async function init() {
      const res = await fetch(treeBasicJSON as any);
      const data: any = await res.json();

      // Add Empty Node
      treeElem.data = data;
    }());
  }

  const newSingleNode = (): Array<IdsTreeData> => {
    const singleNode = [
      {
        id: 'newa',
        text: 'New node'
      }
    ];

    return singleNode;
  };

  const newMultiNode = (): Array<IdsTreeData> => {
    const multiNode = [
      {
        id: 'newb',
        text: 'New node 1'
      },
      {
        id: 'newc',
        text: 'New node 2',
        expanded: false,
        children: [
          {
            id: 'newd',
            text: 'New node 2.1'
          },
          {
            id: 'newe',
            text: 'New node 2.1'
          }
        ]
      },
      {
        id: 'newf',
        text: 'New node 3',
        icon: 'building'
      }
    ];

    return multiNode;
  };

  const menuBtnEl: any = document.querySelector('ids-menu-button');
  let toggle = true;
  const menuItemResponse = (e: CustomEvent) => {
    const target = e.detail.elem;
    if (target !== null) {
      const value = target.value;
      const nodes = toggle ? newSingleNode() : newMultiNode();
      toggle = !toggle;
      if (value === 'top') {
        treeElem!.addNodes(nodes, 'top');
      }
      if (value === 'bottom') {
        treeElem!.addNodes(nodes, 'bottom');
      }
      if (value === 'before') {
        treeElem!.addNodes(nodes, 'before', treeElem!.selected);
      }
      if (value === 'after') {
        treeElem!.addNodes(nodes, 'after', treeElem!.selected);
      }
      if (value === 'child') {
        treeElem!.addNodes(nodes, 'child', treeElem!.selected);
      }
    }
  };

  menuBtnEl.menuEl.addEventListener('selected', (e: any) => {
    menuItemResponse(e);
  });

  treeElem?.addEventListener('selected', (e: any) => {
    console.info(e.detail);
  });
});
