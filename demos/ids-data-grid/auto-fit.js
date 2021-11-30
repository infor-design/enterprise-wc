import { IdsDataGrid } from '../../src/components/ids-data-grid/ids-data-grid';
import './auto-fit.scss';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');

// Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = '/data/products.json';
const columns = [];

// Set up columns
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

xmlhttp.onreadystatechange = function onreadystatechange() {
  if (this.readyState === 4 && this.status === 200) {
    dataGrid.columns = columns;
    dataGrid.data = JSON.parse(this.responseText);
  }
};

// Execute the request
xmlhttp.open('GET', url, true);
xmlhttp.send();
