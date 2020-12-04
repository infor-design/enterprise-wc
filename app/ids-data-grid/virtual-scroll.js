import { IdsDataGrid, IdsDataGridFormatters } from '../../src/ids-data-grid/ids-data-grid';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-1');

// Do an ajax request
const xmlhttp = new XMLHttpRequest();
const url = 'http://localhost:4300/api/products';
const columns = [];

// Set up columns
columns.push({
  id: 'id',
  name: 'ID',
  field: 'id',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'color',
  name: 'Color',
  field: 'color',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'inStock',
  name: 'In Stock',
  field: 'inStock',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'productId',
  name: 'Product Id',
  field: 'productId',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'productName',
  name: 'Product Name',
  field: 'productName',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'unitPrice',
  name: 'Unit Price',
  field: 'unitPrice',
  formatter: IdsDataGridFormatters.Text
});
columns.push({
  id: 'units',
  name: 'Units',
  field: 'units',
  formatter: IdsDataGridFormatters.Text
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
