import type IdsDataGrid from '../ids-data-grid';
import '../../ids-layout-flex/ids-layout-flex';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
// import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-virtual-scroll')!;
const dataGridInitButton = document.querySelector('#data-grid-init-button')!;
const dataGridFirstColumnToggle = document.querySelector('#toggle-first-column')!;

// Do an ajax request
// const url: any = productsJSON;
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

const generateCol = (n: number) => Array.from({ length: n }).map((_x, idx) => ({
  id: `testcol ${idx}`,
  field: `testcol ${idx}`,
  name: `testcol ${idx}`,
  tooltip: (f: any) => f.fieldData,
}));

const getRandomCharacters = (
  length: number,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
) => Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');

const generateRows = (c: any, n: any) => Array.from({ length: n }).map(() => {
  const res: any = {};
  for (let i = 0; i < c.length; i++) {
    res[c[i].id] = getRandomCharacters(9);
  }
  return res;
});

let cols: any = [];
let rows: any = [];
let toggle = true;

const hideShowFirst = () => {
  dataGrid.setColumnVisible(cols[0].id, !toggle);
  toggle = !toggle;
};

const load = (n: any) => {
  cols = generateCol(n);
  rows = generateRows(cols, n);
  dataGrid.columns = cols;
  dataGrid.data = rows;
};

dataGridInitButton.addEventListener('click', () => {
  load(200);
});

dataGridFirstColumnToggle.addEventListener('click', () => {
  hideShowFirst();
});

// const setData = async () => {
//   const res = await fetch(url);
//   const data = await res.json();
//   dataGrid.data = data;
// };

// await setData();

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollstart', async (e: Event) => {
  console.info(`Virtual Scroll reached start`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollend', async (e: Event) => {
  console.info(`Virtual Scroll reached end`, (<CustomEvent>e).detail);
});
