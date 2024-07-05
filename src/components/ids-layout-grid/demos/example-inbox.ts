// Supporting components
import '../../ids-list-view/ids-list-view';
import '../../ids-button/ids-button';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-textarea/ids-textarea';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-radio/ids-radio';
import '../../ids-search-field/ids-search-field';
import '../../ids-spinbox/ids-spinbox';
import '../../ids-switch/ids-switch';
import '../../ids-upload/ids-upload';
import '../../ids-hidden/ids-hidden';
import '../../ids-splitter/ids-splitter';
import productsJSON from '../../../assets/data/products-100.json';
import css from '../../../assets/css/ids-layout-grid/example-inbox.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView: any = document.querySelector('#demo-lv-selectable-single');
const menuButton: any = document.querySelector('#menu-button');
const formCell: any = document.querySelector('#hidden-cell-md');
const listViewCell: any = document.querySelector('#listview-cell');
const splitterPane: any = document.querySelector('#p2');
const breakpointMd = 840;

if (listView) {
  // Do an ajax request and apply the data to the list
  const url: any = productsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    listView.data = data;
  };

  listView.addEventListener('selected', (e: any) => {
    console.info('selected event called', e.detail);
  });
  listView.addEventListener('deselected', (e: any) => {
    console.info('deselected event called', e.detail);
  });
  listView.addEventListener('click', (e: any) => {
    console.info('clicked event called', e.detail);

    formCell.removeAttribute('hide');
    listViewCell.setAttribute('hide', 'md');
    menuButton.icon = 'arrow-left';
  });
  listView.addEventListener('activated', (e: any) => {
    console.info('activated event called', e.detail);
  });

  await setData();
}

if (menuButton) {
  menuButton.addEventListener('click', () => {
    // Check current visibility state
    const isFormHidden = formCell.hasAttribute('hide');
    if (isFormHidden) return;

    formCell.setAttribute('hide', 'md');
    listViewCell.removeAttribute('hide');
    menuButton.icon = 'menu';
  });
}

// Add resize observer for splitter pane to revert back to visible form cell
if (splitterPane) {
  const resizeObserver = new ResizeObserver(() => {
    const paneWidth = splitterPane.getBoundingClientRect().width;

    if (paneWidth > breakpointMd) {
      formCell.setAttribute('hide', 'md');
      listViewCell.removeAttribute('hide');
      menuButton.icon = 'menu';
    }
  });

  resizeObserver.observe(splitterPane);
}
