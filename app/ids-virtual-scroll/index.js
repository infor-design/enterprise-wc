import IdsVirtualScroll from '../../src/ids-virtual-scroll/ids-virtual-scroll';

// Example for populating the Virtual Scoller
const virtualScrollUl = document.querySelector('#virtual-scroll-1');
const virtualScrollTable = document.querySelector('#virtual-scroll-2');

// 1. Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = 'http://localhost:4300/api/products';

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    // 2. Set it on IdsVirtualScroll.data
    virtualScrollUl.itemTemplate = (item) => `<li class="ids-virtual-scroll-item">${item.productName}</li>`;
    virtualScrollUl.data = JSON.parse(this.responseText);

    virtualScrollTable.itemTemplate = (item) => `<tr>
      <td>${item.productId}</td>
      <td>${item.productName}</td>
    </tr>`;
    virtualScrollTable.data = JSON.parse(this.responseText);
  }
};

// 3. Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
