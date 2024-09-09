import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';
import IdsMenuItem from '../../ids-menu/ids-menu-item';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

if (dataGrid) {
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
      hideable: false,
      reorderable: false,
      formatter: dataGrid.formatters.selectionCheckbox,
      align: 'center'
    });
    columns.push({
      id: 'rowNumber',
      name: '#',
      formatter: dataGrid.formatters.rowNumber,
      sortable: false,
      resizable: true,
      reorderable: false,
      readonly: true,
      hideable: false,
      width: 65
    });
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text
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
      reorderable: true,
      formatter: dataGrid.formatters.text,
    });
    columns.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: dataGrid.formatters.integer,
      reorderable: true,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      formatter: dataGrid.formatters.hyperlink,
      href: '#',
      reorderable: true,
      click: () => { console.info('Link was clicked'); }
    });
    columns.push({
      id: 'postHistory',
      name: 'Post History',
      field: 'postHistory',
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'active',
      name: 'Active',
      field: 'active',
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'convention',
      name: 'Convention',
      field: 'convention',
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'methodSwitch',
      name: 'Method Switch',
      field: 'methodSwitch',
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      reorderable: true,
      formatter: dataGrid.formatters.password
    });
    columns.push({
      id: 'deprecationHistory',
      name: 'Deprecation History',
      field: 'deprecationHistory',
      reorderable: true,
      formatter: dataGrid.formatters.text
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data;
    };

    await setData();

    document.querySelector('#row-height-menu')!.addEventListener('selected', async (e: Event) => {
      const action = (e.target as IdsMenuItem).value;
      if (action === 'columns') await dataGrid.showPersonalizationDialog();
      else dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
    });
  }());
}
