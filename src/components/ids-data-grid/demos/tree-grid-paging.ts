import treeLargeJSON from '../../../assets/data/tree-large.json';
import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#tree-grid-paging')!;

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
  id: 'rowNumber',
  name: '#',
  formatter: dataGrid.formatters.rowNumber,
  sortable: false,
  readonly: true,
  width: 66
});

columns.push({
  id: 'id',
  name: 'Id',
  field: 'id',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'location',
  name: 'Location',
  field: 'location',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'capacity',
  name: 'Capacity',
  field: 'capacity',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.integer
});
columns.push({
  id: 'available',
  name: 'Available',
  field: 'available',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.date
});
columns.push({
  id: 'comments',
  name: 'Comments',
  field: 'comments',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});

dataGrid.columns = columns;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  dataGrid.pagination = 'client-side';
  dataGrid.data = data;
  dataGrid.pageTotal = data.length;
};

await setData();

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});

dataGrid.pager.addEventListener('pagenumberchange', (e: Event) => {
  console.info(`client-side page-number # ${(<CustomEvent>e).detail.value}`);
});

dataGrid.pager.addEventListener('pagesizechange', (e: Event) => {
  console.info(`client-side page-size # ${(<CustomEvent>e).detail.value}`);
});
