// Supporting components
import '../../ids-list-view/ids-list-view';
import '../../ids-hidden/ids-hidden';
import '../../ids-toolbar/ids-toolbar';
import '../ids-loading-indicator';
import '../../ids-modal/ids-overlay';
import productsJSON from '../../../assets/data/products-100.json';
import css from '../../../assets/css/ids-layout-grid/example-inbox.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the List View
const listView: any = document.querySelector('#demo-lv-selectable-single');

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
  });
  listView.addEventListener('activated', (e: any) => {
    console.info('activated event called', e.detail);
  });

  await setData();
}
