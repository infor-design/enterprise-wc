import type IdsDataGrid from '../ids-data-grid';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-save-settings')!;
const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;

// Change row height with popup menu
rowHeightMenu?.addEventListener('selected', (e: Event) => {
  dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
});

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
    filterType: dataGrid.filters.text
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
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
    name: 'In Stock',
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
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.integer,
    filterType: dataGrid.filters.integer
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    sortable: true,
    resizable: true,
    reorderable: true,
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
  setData();
}());
