import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import productsJSON from '../../../assets/data/products.json';
import '../../ids-layout-flex/ids-layout-flex';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-virtual-scroll')!;

// Do an ajax request
const url: any = productsJSON;
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
  id: 'rowNumber',
  name: '#',
  formatter: dataGrid.formatters.rowNumber,
  sortable: false,
  readonly: true,
  width: 66
});
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
  formatter: dataGrid.formatters.decimal,
  sortable: true
});
columns.push({
  id: 'units',
  name: 'Units',
  field: 'units',
  formatter: dataGrid.formatters.integer,
  sortable: true
});

dataGrid.columns = columns;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();

  // push arabic text data for testing
  data.push({
    id: 2000,
    productId: '5651591818',
    productName: 'الإنجليزية (أستراليا)',
    inStock: false,
    units: '68',
    unitPrice: 5000,
    color: `Blue`
  });

  // push chinese text data for testing
  data.push({
    id: 2001,
    productId: '5651591819',
    productName: '英语(澳大利亚)',
    inStock: false,
    units: '680',
    unitPrice: 2000,
    color: `Red`
  });

  // push special character text data for testing
  data.push({
    id: 2002,
    productId: '5651591820',
    productName: '!@#$%^*()&<>?:{}[]',
    inStock: true,
    units: '468',
    unitPrice: 100,
    color: `White`
  });

  dataGrid.data = data;
};

setData();

const exportMenu = document.querySelector('#export-excel');
exportMenu?.addEventListener('selected', ((evt: CustomEvent) => {
  const format = evt.detail.value;
  if (format === 'csv') {
    dataGrid.exportToExcel('csv', 'DataGrid (Export)');
  } else {
    dataGrid.exportToExcel('xlsx', 'DataGrid (Export)');
  }
}) as EventListener);
