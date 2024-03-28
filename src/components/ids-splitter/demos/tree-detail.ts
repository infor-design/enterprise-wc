import treeBasicJSON from '../../../assets/data/tree-basic.json';
import eventsJSON from '../../../assets/data/accounts.json';

import '../../ids-container/ids-container';
import '../../ids-button/ids-button';
import '../../ids-list-view/ids-list-view';
import '../ids-splitter';
import '../ids-splitter-pane';
import '../../ids-tree/ids-tree';

document.addEventListener('DOMContentLoaded', async () => {
  const tree: any = document.querySelector('ids-tree');
  const listView = document.querySelector('ids-list-view:not([id])');

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
