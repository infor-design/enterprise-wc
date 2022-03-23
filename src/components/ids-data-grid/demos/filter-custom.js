import IdsDataGrid from '../ids-data-grid';
import IdsContainer from '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector('#data-grid-filter-custom');
const container = document.querySelector('ids-container');

// Custom filter checking
const myCustomFilter = (opt) => {
  const { operator, columnId, value } = opt.condition;
  const val = {
    condition: Number.parseInt(value, 10),
    data: Number.parseInt(opt.data[columnId], 10)
  };
  let isMatch = false;
  if (Number.isNaN(val.condition) || Number.isNaN(val.data)) return isMatch;

  if (operator === 'equals') isMatch = (val.data === val.condition);
  if (operator === 'greater-than') isMatch = (val.data > val.condition);
  if (operator === 'greater-equals') isMatch = (val.data >= val.condition);
  if (operator === 'less-than') isMatch = (val.data < val.condition);
  if (operator === 'less-equals') isMatch = (val.data <= val.condition);

  return isMatch;
};

(async function init() {
  // Set Locale and wait for it to load
  await container.setLocale('en-US');
  const columns = [];

  // Set up columns
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
    id: 'green',
    name: 'Green',
    field: 'color',
    sortable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox,
    isChecked: (value) => value === 'Green'
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    formatter: dataGrid.formatters.text,
    filterFunction: myCustomFilter
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

  // Do an ajax request
  const url = productsJSON;

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };
  setData();
}());
