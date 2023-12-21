import productsJSON from '../../../assets/data/products.json';
import type IdsDataGrid from '../ids-data-grid';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-paging-client-side')!;
const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;

// Change row height with popup menu
rowHeightMenu?.addEventListener('selected', (e: Event) => {
  dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
});

(async function init() {
  const columns: IdsDataGridColumn[] = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'id',
    name: 'ID',
    field: 'id',
    formatter: dataGrid.formatters.text,
    width: 80,
    sortable: true
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    formatter: dataGrid.formatters.text,
    sortable: true
  });

  // Do an ajax request
  const url: any = productsJSON;
  const response = await fetch(url);
  const data = await response.json();
  dataGrid.pagination = 'client-side';
  dataGrid.columns = columns;
  dataGrid.data = data;
  dataGrid.pageTotal = data.length;

  dataGrid.pager.addEventListener('pagenumberchange', (e: Event) => {
    console.info(`client-side page-number # ${(<CustomEvent>e).detail.value}`);
  });

  dataGrid.pager.addEventListener('pagesizechange', (e: Event) => {
    console.info(`client-side page-size # ${(<CustomEvent>e).detail.value}`);
  });

  console.info('Loading Time:', window.performance.now());

  // Example Buttons
  document.querySelector('#add-row')?.addEventListener('click', () => {
    const newRow = { description: 'New Row', ledgder: 'CORE' };
    dataGrid.addRow(newRow);
    dataGrid.setActiveCell(0, dataGrid.data.length - 1);
    dataGrid.editFirstCell();
  });

  document.querySelector('#delete-row')?.addEventListener('click', () => {
    dataGrid.selectedRows.reverse().forEach((row: any) => {
      dataGrid.removeRow(row.index);
    });
  });

  document.querySelector('#clear-row')?.addEventListener('click', () => {
    dataGrid.selectedRows.reverse().forEach((row: any) => {
      dataGrid.clearRow(row.index);
    });
  });
}());
