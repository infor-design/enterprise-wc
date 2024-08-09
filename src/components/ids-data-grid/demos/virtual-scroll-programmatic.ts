import '../../ids-layout-flex/ids-layout-flex';
import '../../ids-button/ids-button';
import '../ids-data-grid';
import type IdsDataGrid from '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';

// Example for programmatically populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-virtual-scroll')!;
const dataGridInitButton = document.querySelector('#data-grid-init-button')!;
const dataGridFirstColumnToggle = document.querySelector('#toggle-first-column')!;

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

const load = (n: any) => {
  cols = columns.concat(generateCol(n));
  rows = generateRows(cols, n);
  dataGrid.columns = cols;
  dataGrid.data = rows;
};

let toggle = true;
const hideShowFirst = () => {
  if (!cols[0]?.id) {
    load(200);
  }

  dataGrid.setColumnVisible(cols[0].id, !toggle);
  toggle = !toggle;
};

dataGridInitButton.addEventListener('click', () => {
  load(200);
});

dataGridFirstColumnToggle.addEventListener('click', () => {
  hideShowFirst();
});

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollstart', async (e: Event) => {
  console.info(`Virtual Scroll reached start`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollend', async (e: Event) => {
  console.info(`Virtual Scroll reached end`, (<CustomEvent>e).detail);
});
