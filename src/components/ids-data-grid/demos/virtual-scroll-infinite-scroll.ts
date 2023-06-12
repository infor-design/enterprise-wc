import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import '../../ids-layout-flex/ids-layout-flex';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

// Do an ajax request
const url: any = productsJSON;
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
  id: 'rowNumber',
  name: '#',
  formatter: dataGrid.formatters.rowNumber,
  sortable: false,
  readonly: true,
  width: 66
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

dataGrid.columns = columns;

const MAX_RESULTS_COUNT = 300;
let data: any = null;
const fetchData = async (startIndex = 0) => {
  if (data === null) {
    const res = await fetch(url);
    const results = await res.json();
    data = results.slice(0, MAX_RESULTS_COUNT);
  }

  if (startIndex > MAX_RESULTS_COUNT) return [];

  const numRowsNeeded = Math.max((MAX_RESULTS_COUNT - startIndex), 0);
  return data.splice(0, Math.min(numRowsNeeded, 33));
};

const setData = async () => {
  dataGrid.data = await fetchData();
};

setData();

dataGrid.addEventListener('scrollend', async (e: Event) => {
  const endIndex = (<CustomEvent>e).detail?.value || 0;

  const moreData = await fetchData(endIndex + 1);
  if (moreData.length) dataGrid.appendData(moreData);
  console.info(`${moreData.length} more rows added`);
});
