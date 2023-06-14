import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import treeLargeJSON from '../../../assets/data/tree-large.json';
import '../../ids-layout-flex/ids-layout-flex';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#tree-grid-filter')!;

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
  id: 'name',
  name: 'Name',
  field: 'name',
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
  id: 'id',
  name: 'Id',
  field: 'id',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});
columns.push({
  id: 'location',
  name: 'Location',
  field: 'location',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
});
columns.push({
  id: 'capacity',
  name: 'Capacity',
  field: 'capacity',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.integer,
  filterType: dataGrid.filters.integer
});
columns.push({
  id: 'available',
  name: 'Available',
  field: 'available',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.date,
  filterType: dataGrid.filters.date
});
columns.push({
  id: 'comments',
  name: 'Comments',
  field: 'comments',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text
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
