import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import '../../ids-toast/ids-toast';
import productsJSON from '../../../assets/data/products.json';

const idsContainer = document.querySelector('ids-container');

const showToast = (title = 'Toast Title', message = 'This is a Toast message.') => {
  const toastId = 'test-demo-toast';
  let toast: any = document.querySelector(`#${toastId}`);
  if (!toast) {
    toast = document.createElement('ids-toast');
    toast.setAttribute('id', toastId);
    idsContainer?.appendChild(toast);
  }
  toast.show({ title, message });
};

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-columns-click-callback')!;

(async function init() {
  const columns: IdsDataGridColumn[] = [];

  // Set up columns
  columns.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    width: 180,
    resizable: true,
    reorderable: true,
    sortable: true,
    filterType: dataGrid.filters.text,
    formatter: (rowData, columnData, index) => {
      const text = `Z ${index}`;
      return `<ids-hyperlink title="${text}, Related Items" tabindex="-1">${text}</ids-hyperlink>`;
    },
    click: (rowData, columnData, event) => {
      console.info('Click Event >>>', rowData, columnData, event);
      showToast('Click Event', 'Running Hyperlink!');
    }
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatOptions: { group: '' },
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    sortable: false,
    resizable: true,
    reorderable: true,
    align: 'center',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox
  });

  // Do an ajax request
  const url: any = productsJSON;

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
    dataGrid.pageTotal = data.length;
  };
  setData();

  // Disable client filter
  dataGrid.addEventListener('filtered', (e: any) => {
    console.info('filtered:', e.detail);
  });
}());
