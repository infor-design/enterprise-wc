// Supporting components
import '../../ids-radio/ids-radio';
import treeBasicJSON from '../../../assets/data/tree-basic.json';
import treeBadgesJSON from '../../../assets/data/tree-badges.json';

// Get some sample data
const getData = async function getData(callback: any, url: any = treeBasicJSON) {
  if (typeof callback === 'function') {
    const res = await fetch(url);
    const data = await res.json();
    callback(data);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // DataSource
  const treeDs: any = document.querySelector('#tree-datasource');
  if (treeDs) {
    await getData((data: any) => {
      treeDs.data = data;
    });
  }

  // Expand Target
  const treeTt: any = document.querySelector('#tree-toggle-target');
  if (treeTt) {
    treeTt.expandTarget = 'icon';
    await getData((data: any) => {
      treeTt.data = data;
    });
  }

  // Expand Target (No icon rotation animtion)
  const treeTtNoIr: any = document.querySelector('#tree-toggle-target-no-rotation');
  if (treeTtNoIr) {
    treeTtNoIr.toggleIconRotate = false;
    treeTtNoIr.collapseIcon = 'plusminus-folder-closed';
    treeTtNoIr.expandIcon = 'plusminus-folder-open';
    treeTtNoIr.toggleCollapseIcon = 'closed-folder';
    treeTtNoIr.toggleExpandIcon = 'open-folder';

    await getData((data: any) => {
      treeTtNoIr.data = data;
    });
  }

  const treeMultiIcons: any = document.querySelector('#tree-multiple-icons');
  if (treeMultiIcons) {
    treeMultiIcons.toggleCollapseIcon = 'play-button-filled';
    treeMultiIcons.toggleExpandIcon = 'play-button-filled';
    treeMultiIcons.collapseIcon = 'chevron-right';
    treeMultiIcons.expandIcon = 'chevron-down';
    treeMultiIcons.icon = 'play-button-filled';
    treeMultiIcons.expandTarget = 'icon';
    treeMultiIcons.showExpandAndToggleIcons = true;

    await getData((data: any) => {
      treeMultiIcons.data = data;
    });
  }

  // Custom Icons
  const treeCi: any = document.querySelector('#tree-custom-icons');
  if (treeCi) {
    treeCi.expandTarget = 'icon';
    treeCi.collapseIcon = 'user-folder-closed';
    treeCi.expandIcon = 'user-folder-open';
    treeCi.toggleCollapseIcon = 'chevron-right';
    treeCi.toggleExpandIcon = 'chevron-down';
    treeCi.icon = 'tree-doc';

    await getData((data: any) => {
      treeCi.data = data;
    });
  }

  // Badges and pre selected node (selected by data)
  const treeBg: any = document.querySelector('#tree-badges');
  if (treeBg) {
    const url = treeBadgesJSON;
    await getData((data: any) => {
      treeBg.data = data;
    }, url);
  }

  // Expand or Collapse
  const treeEc: any = document.querySelector('#tree-expand-or-collapse');
  const btnExpandCollapse = document.querySelector('#btn-tree-expandcollapse');
  if (treeEc) {
    await getData((data: any) => {
      treeEc.data = data;
    });
  }
  btnExpandCollapse?.addEventListener('click', () => {
    const action = (document.querySelector('#radio-tree-expandcollapse') as any).value;
    const id = '#public-folders'; // target node id
    if (action === 'expand') treeEc?.expand(id);
    if (action === 'collapse') treeEc?.collapse(id);
    if (action === 'expand-all') treeEc?.expandAll();
    if (action === 'collapse-all') treeEc?.collapseAll();
  });

  // Disable / Enable
  const treeDe: any = document.querySelector('#tree-disable-enable');
  const btnDisableEnable: any = document.querySelector('#btn-tree-disable-enable');
  const optDe = {
    disabled: false,
    setDisableEnable: () => {
      optDe.disabled = !optDe.disabled;
      treeDe.disabled = optDe.disabled;
      btnDisableEnable.text = `${optDe.disabled ? 'Enable' : 'Disable'} Tree`;
    }
  };
  if (treeDe) {
    await getData((data: any) => {
      treeDe.data = data;
      optDe.setDisableEnable();
    });
  }
  btnDisableEnable?.addEventListener('click', () => {
    optDe.setDisableEnable();
  });

  // Selection
  const treeSl: any = document.querySelector('#tree-selection');
  const btnToggleSelection = document.querySelector('#btn-tree-toggle-selection');
  if (treeSl) {
    await getData((data: any) => {
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
  const treeEv: any = document.querySelector('#tree-events');
  if (treeEv) {
    const show = (type: any, detail: any) => (console.info(type, detail));
    await getData((data: any) => {
      treeEv.data = data;
    });
    treeEv.expandTarget = 'icon';
    treeEv.addEventListener('beforeselected', (e: any) => {
      show('beforeselected', e.detail);
      // e.detail.response(false); // veto
    });
    treeEv.addEventListener('selected', (e: any) => {
      show('selected', e.detail);
    });
    treeEv.addEventListener('beforecollapsed', (e: any) => {
      show('beforecollapsed', e.detail);
      // e.detail.response(false); // veto
    });
    treeEv.addEventListener('collapsed', (e: any) => {
      show('collapsed', e.detail);
    });
    treeEv.addEventListener('beforeexpanded', (e: any) => {
      show('beforeexpanded', e.detail);
      // e.detail.response(false); // veto
    });
    treeEv.addEventListener('expanded', (e: any) => {
      show('expanded', e.detail);
    });
  }

  // Characters and Symbols
  const treeCs: any = document.querySelector('#tree-characters-and-symbols');
  if (treeCs) {
    const data = [{
      id: 'cs-1',
      text: '<online onload="alert()">'
    }, {
      id: 'cs-2',
      text: `& "
        &#33; &#34; &#35; &#36; &#37; &#38; &#39;
        &#40; &#41; &#42; &#43; &#44; &#45; &#46; &#47;
        &#161;, &#162;, &#163;, &#164;, &#165;, &#166;, &#167;, &#169;`
    }];

    treeCs.data = data;
  }
});
