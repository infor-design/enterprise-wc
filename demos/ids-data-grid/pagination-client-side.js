import { IdsDataGrid } from '../../src/components/ids-data-grid/ids-data-grid';
import { IdsContainer } from '../../src/components/ids-container/ids-container';

// Example for populating the DataGrid
const dataGrid = document.querySelector('ids-data-grid');
const container = document.querySelector('ids-container');

(async function init() {
  // Set Locale and wait for it to load
  await container.setLocale('en-US');
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

  // Do an ajax request
  const url = '/data/products.json';
  const response = await fetch(url);
  const data = await response.json();
  dataGrid.columns = columns;
  dataGrid.data = data;

  console.info('Loading Time:', window.performance.now());
  console.info('Page Memory:', window.performance.memory);
}());
