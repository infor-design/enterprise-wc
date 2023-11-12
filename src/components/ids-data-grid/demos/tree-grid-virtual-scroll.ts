import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import treeLargeJSON from '../../../assets/data/tree-large-children.json';
import '../../ids-layout-flex/ids-layout-flex';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#tree-grid-virtual-scroll')!;

// Do an ajax request
const url: any = treeLargeJSON;
const columns: IdsDataGridColumn[] = [];

// Set up columns
columns.push({
  id: 'selectionCheckbox',
  name: 'selection',
  sortable: false,
  resizable: false,
  formatter: dataGrid.formatters.selectionCheckbox,
  align: 'center',
  frozen: 'left'
});

columns.push({
  id: 'fullName',
  name: 'Full Name',
  field: 'fullName',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.tree,
  click: (info: any) => {
    console.info('Tree Expander Clicked', info);
  },
  width: 220,
  frozen: 'left'
});

columns.push({
  id: 'rowNumber',
  name: 'Row #',
  formatter: dataGrid.formatters.rowNumber,
  sortable: false,
  readonly: true,
  width: 66
});

columns.push({
  id: 'zipCode',
  name: 'Zip',
  field: 'zipCode',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});

columns.push({
  id: 'street',
  name: 'Street',
  field: 'street',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});

dataGrid.columns = columns;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  dataGrid.data = data.slice(0, 50);
};

setData();

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});

dataGrid.addEventListener('scrollend', (e: Event) => {
  console.info(`scrollend`, (<CustomEvent>e).detail);
});
