import productsJSON from '../../../assets/data/products.json';
import css from '../../../assets/css/ids-virtual-scroll/index.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssLink);
}

// Example for populating the Virtual Scoller
const virtualScrollUl: any = document.querySelector('#virtual-scroll-1');
const virtualScrollTable: any = document.querySelector('#virtual-scroll-2');
if (virtualScrollUl) {
  const url: any = productsJSON;

  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    // Setup the list view
    virtualScrollUl.data = data;
    virtualScrollUl.itemTemplate = (item: any) => `<div part="list-item">${item.productName}</div>`;
    // Set up the table
    virtualScrollTable.scrollTarget = document.querySelector('.ids-data-grid');
    virtualScrollTable.itemTemplate = (item: any) => `<div part="row" role="row" class="ids-data-grid-row">
      <span role="cell" part="cell" class="ids-data-grid-cell"><span class="text-ellipsis" part="text-ellipsis">${item.productId}</span></span>
      <span role="cell" part="cell" class="ids-data-grid-cell"><span class="text-ellipsis" part="text-ellipsis">${item.productName}</span></span>
    </div>`;
    virtualScrollTable.data = data;
  };

  setData();
}
