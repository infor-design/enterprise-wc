import treeBasicJSON from '../../../assets/data/tree-basic.json';
import eventsJSON from '../../../assets/data/accounts.json';

import '../../ids-container/ids-container';
import '../../ids-button/ids-button';
import '../../ids-list-view/ids-list-view';
import '../../ids-tree/ids-tree';
import type IdsSplitter from '../ids-splitter';
import '../ids-splitter-pane';
import '../ids-splitter';

document.addEventListener('DOMContentLoaded', async () => {
  const tree: any = document.querySelector('ids-tree');
  const listView = document.querySelector('ids-list-view:not([id])');
  const btn = document.querySelector('#expand-collapse-btn');
  const splitter = document.querySelector<IdsSplitter>('ids-splitter');
  const leftPane = document.querySelector<HTMLElement>('#left-pane');
  const rightPane = document.querySelector<HTMLElement>('#right-pane');

  if (btn) {
    btn.addEventListener('click', () => {
      const leftCollapsed = leftPane?.hasAttribute('collapsed');
      const rightCollapsed = rightPane?.hasAttribute('collapsed');

      if (leftCollapsed || rightCollapsed) {
        splitter?.expand({
          startPane: leftCollapsed ? leftPane as HTMLElement : rightPane as HTMLElement,
          endPane: leftCollapsed ? rightPane as HTMLElement : leftPane as HTMLElement,
        });
        return;
      }
      splitter?.collapse({
        startPane: leftPane as HTMLElement,
        endPane: rightPane as HTMLElement,
      });
    });
  }

  // get tree data
  if (tree) {
    (async function init() {
      // Do an ajax request
      const res = await fetch(treeBasicJSON as any);
      const data: any = await res.json();
      tree.data = data;
    }());
  }

  // get listView data
  if (listView) {
    // Do an ajax request and apply the data to the list
    const url: any = eventsJSON;

    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      (listView as any).data = data;
    };

    await setData();
  }
});
