import type IdsDataGrid from '../ids-data-grid';
import '../../ids-layout-flex/ids-layout-flex';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-virtual-scroll')!;

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

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  dataGrid.data = data;
};

setData();

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollstart', async (e: Event) => {
  console.info(`Virtual Scroll reached start`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollend', async (e: Event) => {
  console.info(`Virtual Scroll reached end`, (<CustomEvent>e).detail);
});
