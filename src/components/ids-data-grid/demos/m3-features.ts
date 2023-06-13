import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import productInfo from '../../../assets/data/product-info.json';
import '../../ids-layout-flex/ids-layout-flex';

// Custom Datagrid Cell Colors are defined in this file:
import css from '../../../assets/css/ids-data-grid/custom-css.css';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#m3-virtual-scroll')!;

// Do an ajax request
const url: any = productInfo;
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
  name: 'Id',
  field: 'id',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'itemNumber',
  name: 'Item Number',
  field: 'itemNumber',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
  filterType: dataGrid.filters.text,
  filterConditions: []
});
columns.push({
  id: 'testingProcedure',
  name: 'Testing Procedure',
  field: 'testingProcedure',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'eco',
  name: 'Eco',
  field: 'eco',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.checkbox
});
columns.push({
  id: 'check',
  name: 'Check',
  field: 'check',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.date
});
columns.push({
  id: 'release',
  name: 'Release',
  field: 'release',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'itemMgr',
  name: 'Item Mgr',
  field: 'itemMgr',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'allocation',
  name: 'Allocation',
  field: 'allocation',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'unitOfMeasure',
  name: 'Unit Of Measure',
  field: 'unitOfMeasure',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'businessArea',
  name: 'Business Area',
  field: 'businessArea',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'price',
  name: 'Price',
  field: 'price',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.decimal
});
columns.push({
  id: 'color',
  name: 'Color',
  field: 'color',
  align: 'center',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
});
columns.push({
  id: 'icon',
  name: 'Icon',
  field: 'icon',
  align: 'center',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.icon,
  color: 'success',
});
columns.push({
  id: 'qtyOnHand',
  name: 'Qty On Hand',
  field: 'qtyOnHand',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'refProductId',
  name: 'Ref Product Id',
  field: 'refProductId',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'sku',
  name: 'SKU',
  field: 'sku',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'upc',
  name: 'UPC',
  field: 'upc',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text
});
columns.push({
  id: 'category',
  name: 'Tag',
  field: 'category',
  align: 'center',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.tag,
  color: 'info',
  cssPart: (row: number) => ((row % 2 === 0) ? 'custom-cell' : ''),
});
columns.push({
  id: 'category-alert',
  name: 'Alert',
  field: 'category',
  align: 'center',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.alert,
  color: 'info',
  cssPart: (row: number) => ((row % 2 === 0) ? 'custom-cell' : ''),
});
columns.push({
  id: 'weight',
  name: 'Weight',
  field: 'weight',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
  cssPart: 'custom-cell'
});
columns.push({
  id: 'shipWeight',
  name: 'Ship Weight',
  field: 'shipWeight',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.text,
  cssPart: 'custom-cell'
});
columns.push({
  id: 'manufacturer',
  name: 'Manufacturer',
  field: 'manufacturer',
  sortable: true,
  resizable: true,
  width: 185,
  formatter: (rowData: Record<string, unknown>, columnData: Record<string, any>) => {
    const value = `${rowData[columnData.field] || ''}`;
    return !value ? '' : `<span class="text-ellipsis">${value}&nbsp;<ids-icon part="custom-cell-icon" icon="edit"></ids-icon></span>`;
  },
  cssPart: 'custom-cell'
});
columns.push({
  id: 'qtyOnOrder',
  name: 'Qty On Order',
  field: 'qtyOnOrder',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.integer
});
columns.push({
  id: 'enable',
  name: 'Enable',
  field: 'enable',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.checkbox
});
columns.push({
  id: 'taxable',
  name: 'Taxable',
  field: 'taxable',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.checkbox
});
columns.push({
  id: 'lowStockAlert',
  name: 'Low Stock Alert',
  field: 'lowStockAlert',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.checkbox
});
columns.push({
  id: 'createdData',
  name: 'Created Data',
  field: 'createdData',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.date
});
columns.push({
  id: 'modifiedData',
  name: 'Modified Data',
  field: 'modifiedData',
  sortable: true,
  resizable: true,
  formatter: dataGrid.formatters.date
});

dataGrid.columns = columns;

const setData = async () => {
  const res = await fetch(url);
  const data = await res.json();
  dataGrid.data = data;
};

setData();

dataGrid.addEventListener('selectionchanged', (e: Event) => {
  console.info(`Selection Changed`, (<CustomEvent>e).detail);
});
