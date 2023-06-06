import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-disable-client-filter')!;

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
    name: 'ID',
    field: 'id',
    width: 80,
    resizable: true,
    reorderable: true,
    sortable: true,
    formatter: dataGrid.formatters.text,
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text,
    align: 'right'
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatOptions: { group: '' },
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    sortable: true,
    resizable: true,
    reorderable: true,
    align: 'center',
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.checkbox
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    width: 280,
    filterType: dataGrid.filters.date,
    formatter: dataGrid.formatters.date,
    headerAlign: 'right',
  });
  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishTime',
    width: 280,
    filterType: dataGrid.filters.time,
    formatter: dataGrid.formatters.time,
    headerAlign: 'right',
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

  // Disable client filter
  dataGrid.addEventListener('filtered', (e: any) => {
    console.info('filtered:', e.detail);
  });
}());
