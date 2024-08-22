import IdsTree from '../ids-tree';
import { IdsTreeNodeData } from '../ids-tree-node';

document.addEventListener('DOMContentLoaded', () => {
  const treeElem = document.querySelector<IdsTree>('#tree-demo-issue');

  const homeNode = (): Array<IdsTreeNodeData> => {
    const singleNode = [
      {
        id: 'newa',
        text: 'Home'
      }
    ];

    return singleNode;
  };

  const newMultiNode = (): Array<IdsTreeNodeData> => {
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

  if (treeElem) {
    treeElem.data = homeNode();
    const rootNode = treeElem.getNode('#newa');
    const childNodes = newMultiNode();
    treeElem!.addNodes(childNodes, 'child', rootNode?.elem);
  }

  treeElem!.addEventListener('selected', (e: any) => {
    console.info(e.detail.node.data);
  });
});
