import IdsVirtualScroll from '../../src/ids-virtual-scroll/ids-virtual-scroll';
import IdsCard from '../../src/ids-card/ids-card';
import './index.scss';

// Example for populating the Virtual Scoller
const virtualScrollUl = document.querySelector('#virtual-scroll-1');
const virtualScrollTable = document.querySelector('#virtual-scroll-2');

// 1. Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = 'http://localhost:4300/api/products';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    // Setup the list view
    virtualScrollUl.itemTemplate = (item) => `<li class="ids-virtual-scroll-item">${item.productName}</li>`;
    virtualScrollUl.data = JSON.parse(this.responseText);

    // Set up the table
    virtualScrollTable.scrollTarget = document.querySelector('.ids-data-grid');
    virtualScrollTable.itemTemplate = (item) => `<div role="row" class="ids-data-grid-row">
      <span role="cell" class="ids-data-grid-cell">${item.productId}</span>
      <span role="cell" class="ids-data-grid-cell">${item.productName}</span>
    </div>`;
    virtualScrollTable.data = JSON.parse(this.responseText);
  }
};

// 3. Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
