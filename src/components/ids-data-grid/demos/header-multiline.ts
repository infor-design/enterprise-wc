import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';
import IdsToggleButton from '../../ids-toggle-button/ids-toggle-button';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-filter')!;

(async function init() {
  const columns: IdsDataGridColumn[] = [];

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
    name: [
      { text: 'Row ID' },
      { text: 'Numeric', emphasis: 'subtle' },
    ],
    field: 'id',
    width: 120,
    resizable: true,
    reorderable: true,
    sortable: true,
    formatter: dataGrid.formatters.text,
  });
  columns.push({
    id: 'color',
    name: [
      { text: 'Color' },
      { text: 'String', emphasis: 'subtle' },
    ],
    field: 'color',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text
  });
  columns.push({
    id: 'productId',
    name: [
      { text: 'Product Id' },
      { text: 'Numeric', emphasis: 'subtle' },
    ],
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer
  });
  columns.push({
    id: 'productName',
    name: [
      { text: 'Product Name' },
      { text: 'with long description' },
    ],
    field: 'productName',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text,
    filterConditions: [{
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
    name: [
      { text: 'In Stock' },
      { text: 'Boolean', emphasis: 'subtle' },
    ],
    field: 'inStock',
    sortable: false,
    resizable: true,
    reorderable: true,
    align: 'center',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox
  });
  columns.push({
    id: 'unitPrice',
    name: [
      { text: 'Unit Price' },
      { text: 'Number', emphasis: 'subtle' },
    ],
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.integer,
    filterType: dataGrid.filters.integer
  });
  columns.push({
    id: 'units',
    name: [
      { text: 'Units' },
      { text: 'Number', emphasis: 'subtle' },
    ],
    field: 'units',
    sortable: true,
    resizable: true,
    reorderable: true,
    align: 'right',
    filterAlign: 'left',
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
    dataGrid.pageTotal = data.length;
  };
  await setData();

  // Toggle Filter Row
  document.querySelector<IdsToggleButton>('#hide-filter-row')!.addEventListener('click', (e: any) => {
    e.target.toggle();
    dataGrid.filterable = !dataGrid.filterable;
  });
}());
