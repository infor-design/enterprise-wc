import IdsDataGrid from '../ids-data-grid';
import '../../ids-popup-menu/ids-popup-menu';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-filter-custom')!;

// Custom filter checking
const myCustomFilter = (opt: any) => {
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
  if (operator === 'start-with') isMatch = (val.data.toString().startsWith(val.condition.toString()));

  return isMatch;
};

(async function init() {
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
    id: 'no-operator',
    name: 'No operators',
    field: 'color',
    sortable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    align: 'center',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox,
    isChecked: (value: any) => value === true
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
  const url: any = productsJSON;

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
    dataGrid.pageTotal = data.length;
  };
  setData();
}());
