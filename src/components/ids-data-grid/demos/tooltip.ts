import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn, IdsDataGridTooltipCallback } from '../ids-data-grid-column';
import '../../ids-container/ids-container';
import productsJSON from '../../../assets/data/products.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-tooltip')!;

(async function init() {
  // Define tooltip callback
  const tooltipCallback = (args: IdsDataGridTooltipCallback): string => {
    const {
      type,
      columnIndex,
      rowIndex,
      text
    } = args;

    /**
     * See logs for available args, with each type
     * types: `body-cell`, `filter-button`, `header-title`, `header-icon`
     */
    console.info(args);

    if (type === 'header-title') {
      return `Text: ${text}<br/>Header Row: ${rowIndex}, Cell: ${columnIndex}`;
    }
    if (type === 'filter-button') {
      return `Text: ${text}<br/>FilterButton Row: ${rowIndex}, Cell: ${columnIndex}`;
    }
    return `Text: ${text}<br/>for Row: ${rowIndex}, Cell: ${columnIndex}`;
  };

  // Define async tooltip callback.
  const tooltipCallbackAsync = async (args: IdsDataGridTooltipCallback): Promise<string> => {
    const {
      type,
      columnIndex,
      rowIndex,
      text
    } = args;

    return new Promise((resolve) => {
      setTimeout(() => {
        let tooltipContent = '';
        if (type === 'header-title') {
          tooltipContent = `Async Text: ${text}<br/>Header Row: ${rowIndex}, Cell: ${columnIndex}`;
        } else if (type === 'filter-button') {
          tooltipContent = `Async Text: ${text}<br/>FilterButton Row: ${rowIndex}, Cell: ${columnIndex}`;
        } else {
          tooltipContent = `Async Text: ${text}<br/>Row: ${rowIndex}, Cell: ${columnIndex}`;
        }
        resolve(tooltipContent);
      }, 300);
    });
  };

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
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'customTooltip',
    name: 'Custom Tooltip',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.hyperlink,
    formatOptions: { group: '' },
    width: 140,
    tooltip: 'This is a product Id',
    headerTooltip: 'This is the product Id header',
    filterButtonTooltip: 'This is the product Id filterButton',
    tooltipOptions: {
      placement: 'right',
      headerPlacement: 'top',
      filterButtonPlacement: 'bottom',
      x: 10,
      y: 0,
      headerX: 0,
      headerY: 10,
      filterButtonX: 0,
      filterButtonY: 22
    }
  });
  columns.push({
    id: 'color',
    name: 'Tooltip Callback',
    field: 'color',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    filterType: dataGrid.filters.text,
    width: 105,
    tooltip: tooltipCallback
  });
  columns.push({
    id: 'productId',
    name: 'Tooltip async Callback',
    field: 'productId',
    sortable: true,
    resizable: true,
    reorderable: true,
    filterType: dataGrid.filters.integer,
    formatter: dataGrid.formatters.integer,
    formatOptions: { group: '' },
    tooltip: tooltipCallbackAsync
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
    filterType: dataGrid.filters.checkbox,
    headerIcon: 'info',
    headerIconTooltip: 'This is header icon',
    tooltipOptions: {
      headerIconPlacement: 'top',
      headerIconX: 0,
      headerIconY: 16
    }
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.integer,
    filterType: dataGrid.filters.integer,
    tooltip: 'This is Unit Price',
    headerTooltip: 'This is Unit Price header',
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

    // Set veto before tooltip show
    dataGrid.addEventListener('beforetooltipshow', (e: any) => {
      const { rowIndex, columnIndex } = (<CustomEvent>e).detail.data;
      const veto = !(rowIndex === 4 && columnIndex === 2);
      if (!veto) {
        console.info('Veto!: ', (<CustomEvent>e).detail.data);
        (<CustomEvent>e).detail.response(veto);
      }
    });
  };
  setData();
}());
