import IdsVirtualScroll from '../ids-virtual-scroll';
import IdsCard from '../../ids-card/ids-card';
import productsJSON from '../../../assets/data/products.json';
import css from '../../../assets/css/ids-virtual-scroll/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head').insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the Virtual Scoller
const virtualScrollUl = document.querySelector('#virtual-scroll-1');
const virtualScrollTable = document.querySelector('#virtual-scroll-2');

// TODO: Add datagrid.css once standalone css is done.

const url = productsJSON;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  // Setup the list view
  virtualScrollUl.data = data;
  virtualScrollUl.itemTemplate = (item) => `<div part="list-item">${item.productName}</div>`;
  // Set up the table
  virtualScrollTable.scrollTarget = document.querySelector('.ids-data-grid');
  virtualScrollTable.itemTemplate = (item) => `<div part="row" role="row" class="ids-data-grid-row">
    <span role="cell" part="cell" class="ids-data-grid-cell"><span class="text-ellipsis" part="text-ellipsis">${item.productId}</span></span>
    <span role="cell" part="cell" class="ids-data-grid-cell"><span class="text-ellipsis" part="text-ellipsis">${item.productName}</span></span>
  </div>`;
  virtualScrollTable.data = data;
};

setData();
