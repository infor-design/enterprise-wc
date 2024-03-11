import treeBasicJSON from '../../../assets/data/tree-basic.json';
import eventsJSON from '../../../assets/data/accounts.json';

import '../../ids-button/ids-button';
import '../../ids-list-view/ids-list-view';
import '../ids-modal';
import '../ids-modal-button';
import '../../ids-splitter/ids-splitter';
import '../../ids-splitter/ids-splitter-pane';
import '../../ids-tree/ids-tree';

import type IdsModal from '../ids-modal';
import type IdsListView from '../../ids-list-view/ids-list-view';
import type IdsSplitter from '../../ids-splitter/ids-splitter';

document.addEventListener('DOMContentLoaded', async () => {
  const triggerId = '#modal-trigger-btn';
  const triggerBtn: any = document.querySelector(triggerId);
  const modal = document.querySelector<IdsModal>('ids-modal')!;
  const tree: any = document.querySelector('ids-tree');
  const listView = document.querySelector<IdsListView>('ids-list-view:not([id])');
  const splitter = document.querySelector<IdsSplitter>('ids-splitter');

  modal.style.setProperty('--ids-modal-content-padding', '0');
  modal.style.setProperty('--ids-modal-footer-margin', '1px 0 0 0');

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

  // Links the Modal to its trigger button (sets up click/focus events)
  modal.target = triggerBtn;
  modal.triggerType = 'click';
  modal.fullsize = 'always';

  // Disable the trigger button when showing the Modal.
  modal.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  modal.addEventListener('aftershow', () => {
    splitter?.resize();
  });

  // Close the modal when its inner button is clicked.
  modal.onButtonClick = async () => {
    await modal.hide();
  };

  // After the modal is done hiding, re-enable its trigger button.
  modal.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
