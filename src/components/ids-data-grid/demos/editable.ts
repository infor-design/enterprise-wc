import type IdsDataGrid from '../ids-data-grid';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-editable')!;
const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;

// Change row height with popup menu
rowHeightMenu?.addEventListener('selected', (e: Event) => {
  dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
});

(async function init() {
  // Do an ajax request
  const url: any = booksJSON;
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
    resizable: true,
    reorderable: true,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    editor: {
      type: 'input',
      inline: true
    }
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.date
  });
  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.time
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'transactionCurrency',
    name: 'Transaction Currency',
    field: 'transactionCurrency',
    formatter: dataGrid.formatters.text,
  });
  columns.push({
    id: 'integer',
    name: 'Price (Int)',
    field: 'price',
    formatter: dataGrid.formatters.integer,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    formatter: dataGrid.formatters.hyperlink,
    href: '#'
  });
  columns.push({
    id: 'postHistory',
    name: 'Post History',
    field: 'postHistory',
    formatter: dataGrid.formatters.text
  });

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };

  setData();

  // Event Handlers
  dataGrid.addEventListener('beforecelledit', (e: Event) => {
    // Can be vetoed (<CustomEvent>e).detail.response(false);
    console.info(`Edit Started`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('celledit', (e: Event) => {
    console.info(`Currently Editing`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('endcelledit', (e: Event) => {
    console.info(`Edit Ended`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('cancelcelledit', (e: Event) => {
    console.info(`Edit Was Cancelled`, (<CustomEvent>e).detail);
  });
}());
