import IdsCard from '../../src/components/ids-card/ids-card';
import './index.scss';

// Example for populating the Virtual Scoller
const virtualScrollUl = document.querySelector('#virtual-scroll-1');
const virtualScrollTable = document.querySelector('#virtual-scroll-2');

// 1. Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = '/data/products.json';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    // Setup the list view
    virtualScrollUl.itemTemplate = (item) => `<div part="list-item">${item.productName}</div>`;
    virtualScrollUl.data = JSON.parse(this.responseText);

    // Set up the table
    virtualScrollTable.scrollTarget = document.querySelector('.ids-data-grid');
    virtualScrollTable.itemTemplate = (item) => `<div part="row" role="row" class="ids-data-grid-row">
      <span role="cell" part="cell" class="ids-data-grid-cell"><span class="text-ellipsis" part="text-ellipsis">${item.productId}</span></span>
      <span role="cell" part="cell" class="ids-data-grid-cell"><span class="text-ellipsis" part="text-ellipsis">${item.productName}</span></span>
    </div>`;
    virtualScrollTable.data = JSON.parse(this.responseText);
  }
};

// 3. Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
