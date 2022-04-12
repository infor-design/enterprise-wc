import '../ids-data-grid';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid: any = document.querySelector('#data-grid-filter');
const container: any = document.querySelector('ids-container');

(async function init() {
  // Set Locale and wait for it to load
  await container.setLocale('en-US');
  const columns = [];

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
    id: 'id',
    name: 'ID',
    field: 'id',
    width: 80,
    sortable: true,
    formatter: dataGrid.formatters.text,
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    sortable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    sortable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text,
    filterTerms: [{
      value: 'contains',
      label: 'Contains',
      icon: 'filter-contains'
    },
    {
      value: 'equals',
      label: 'Equals',
      icon: 'filter-equals',
      selected: true
    }]
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    sortable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    formatter: dataGrid.formatters.integer,
    filterType: dataGrid.filters.integer
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    sortable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text
  });

  // Do an ajax request
  const url: any = productsJSON;

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };
  setData();
}());
