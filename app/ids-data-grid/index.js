import { IdsDataGrid, IdsDataGridFormatters } from '../../src/ids-data-grid/ids-data-grid';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');

// Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = 'http://localhost:4300/api/books';
const columns = [];

// Set up columns
columns.push({
  id: 'selectionCheckbox',
  sortable: false,
  resizable: false,
  formatter: IdsDataGridFormatters.Text,
  align: 'center'
});
columns.push({
  id: 'book',
  name: 'Book',
  field: 'book',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'description',
  name: 'Description',
  field: 'description',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'ledger',
  name: 'Ledger',
  field: 'ledger',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'bookCurrency',
  name: 'Book Currency',
  field: 'bookCurrency',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'transactionCurrency',
  name: 'Transaction Currency',
  field: 'transactionCurrency',
  formatter: IdsDataGridFormatters.Text,
});
columns.push({
  id: 'postHistory',
  name: 'Post History',
  field: 'postHistory',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'active',
  name: 'Active',
  field: 'active',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'convention',
  name: 'Convention',
  field: 'convention',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'methodSwitch',
  name: 'Method Switch',
  field: 'methodSwitch',
  formatter: IdsDataGridFormatters.Text,
  filterType: 'select'
});
columns.push({
  id: 'trackDeprecationHistory',
  name: 'Track Deprecation History',
  field: 'trackDeprecationHistory',
  formatter: IdsDataGridFormatters.Dropdown
});
columns.push({
  id: 'useForEmployee',
  name: 'Use For Employee',
  field: 'useForEmployee',
  formatter: IdsDataGridFormatters.Dropdown
});
columns.push({
  id: 'deprecationHistory',
  name: 'Deprecation History',
  field: 'deprecationHistory',
  formatter: IdsDataGridFormatters.Dropdown
});

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    dataGrid.columns = columns;
    dataGrid.data = JSON.parse(this.responseText);
  }
};

// Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
