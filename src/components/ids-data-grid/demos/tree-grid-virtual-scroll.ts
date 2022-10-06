import '../ids-data-grid';
import treeLargeJSON from '../../../assets/data/tree-large.json';

// Example for populating the DataGrid
const dataGrid: any = document.querySelector('#tree-grid-virtual-scroll');

// Do an ajax request
const url: any = treeLargeJSON;
const columns = [];

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
  dataGrid.data = data;
};

setData();

dataGrid.addEventListener('selectionchanged', (e: CustomEvent) => {
  console.info(`Selection Changed`, e.detail);
});
