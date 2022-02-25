// Supporting components
import '../../ids-radio/ids-radio';

// Get some sample data
const getData = async function getData(callback, url = '/data/tree-basic.json') {
  if (typeof callback === 'function') {
    const res = await fetch(url);
    const data = await res.json();
    callback(data);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // DataSource
  const treeDs = document.querySelector('#tree-datasource');
  if (treeDs) {
    await getData((data) => {
      treeDs.data = data;
    });
  }

  // Toggle Target
  const treeTt = document.querySelector('#tree-toggle-target');
  if (treeTt) {
    treeTt.useToggleTarget = true;
    await getData((data) => {
      treeTt.data = data;
    });
  }

  // Toggle Target (No Icon Rotation)
  const treeTtNoIr = document.querySelector('#tree-toggle-target-no-rotation');
  if (treeTtNoIr) {
    treeTtNoIr.toggleIconRotate = false;
    treeTtNoIr.useToggleTarget = true;
    await getData((data) => {
      treeTtNoIr.data = data;
    });
  }

  // Custom Icons
  const treeCi = document.querySelector('#tree-custom-icons');
  if (treeCi) {
    treeCi.useToggleTarget = true;
    treeCi.collapseIcon = 'user-folder-closed';
    treeCi.expandIcon = 'user-folder-open';
    treeCi.toggleCollapseIcon = 'chevron-right';
    treeCi.toggleExpandIcon = 'chevron-down';
    treeCi.icon = 'tree-doc';

    await getData((data) => {
      treeCi.data = data;
    });
  }

  // Badges and pre selected node (selected by data)
  const treeBg = document.querySelector('#tree-badges');
  if (treeBg) {
    const url = '/data/tree-badges.json';
    await getData((data) => {
      treeBg.data = data;
    }, url);
  }

  // Expand or Collapse
  const treeEc = document.querySelector('#tree-expand-or-collapse');
  const btnExpandCollapse = document.querySelector('#btn-tree-expandcollapse');
  if (treeEc) {
    await getData((data) => {
      treeEc.data = data;
    });
  }
  btnExpandCollapse?.addEventListener('click', () => {
    const action = document.querySelector('#radio-tree-expandcollapse').value;
    const id = '#public-folders'; // target node id
    if (action === 'expand') treeEc?.expand(id);
    if (action === 'collapse') treeEc?.collapse(id);
    if (action === 'expand-all') treeEc?.expandAll();
    if (action === 'collapse-all') treeEc?.collapseAll();
  });

  // Disable / Enable
  const treeDe = document.querySelector('#tree-disable-enable');
  const btnDisableEnable = document.querySelector('#btn-tree-disable-enable');
  const optDe = {
    disabled: false,
    setDisableEnable: () => {
      optDe.disabled = !optDe.disabled;
      treeDe.disabled = optDe.disabled;
      btnDisableEnable.text = `${optDe.disabled ? 'Enable' : 'Disable'} Tree`;
    }
  };
  if (treeDe) {
    await getData((data) => {
      treeDe.data = data;
      optDe.setDisableEnable();
    });
  }
  btnDisableEnable?.addEventListener('click', () => {
    optDe.setDisableEnable();
  });

  // Selection
  const treeSl = document.querySelector('#tree-selection');
  const btnToggleSelection = document.querySelector('#btn-tree-toggle-selection');
  if (treeSl) {
    await getData((data) => {
      treeSl.data = data;
    });
  }
  btnToggleSelection?.addEventListener('click', () => {
    const id = '#public-folders'; // target node id
    const isSelected = treeSl?.isSelected(id);
    if (isSelected) {
      treeSl?.unselect(id);
    } else {
      treeSl?.select(id);
    }
  });

  // Events
  const treeEv = document.querySelector('#tree-events');
  if (treeEv) {
    const show = (type, detail) => (console.info(type, detail));
    await getData((data) => {
      treeEv.data = data;
    });
    treeEv.useToggleTarget = true;
    treeEv.addEventListener('beforeselected', (e) => {
      show('beforeselected', e.detail);
      // e.detail.response(false); // veto
    });
    treeEv.addEventListener('selected', (e) => {
      show('selected', e.detail);
    });
    treeEv.addEventListener('beforecollapsed', (e) => {
      show('beforecollapsed', e.detail);
      // e.detail.response(false); // veto
    });
    treeEv.addEventListener('collapsed', (e) => {
      show('collapsed', e.detail);
    });
    treeEv.addEventListener('beforeexpanded', (e) => {
      show('beforeexpanded', e.detail);
      // e.detail.response(false); // veto
    });
    treeEv.addEventListener('expanded', (e) => {
      show('expanded', e.detail);
    });
  }

  // Characters and Symbols
  const treeCs = document.querySelector('#tree-characters-and-symbols');
  if (treeCs) {
    const data = [{
      id: 'cs-1',
      text: '<online onload="alert()">'
    }, {
      id: 'cs-2',
      text: `< > & "
        &#33; &#34; &#35; &#36; &#37; &#38; &#39;
        &#40; &#41; &#42; &#43; &#44; &#45; &#46; &#47;
        &#161;, &#162;, &#163;, &#164;, &#165;, &#166;, &#167;, &#169;`
    }];

    treeCs.data = data;
  }
});
