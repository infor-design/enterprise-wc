import IdsCard from '../../src/components/ids-card/ids-card';
import './index.scss';

// Example for populating the Virtual Scoller
const virtualScrollUl = document.querySelector('#virtual-scroll-1');
const virtualScrollTable = document.querySelector('#virtual-scroll-2');

const url = '/data/products.json';

fetch(url)
  .then(
    (res) => {
      if (res.status !== 200) {
        return;
      }

      res.json().then((data) => {
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
      });
    }
  );
