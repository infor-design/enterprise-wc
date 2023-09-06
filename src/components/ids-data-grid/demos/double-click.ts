import type IdsDataGrid from '../ids-data-grid';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';
import IdsGlobal from '../../ids-global/ids-global';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-double-click');
const locale = IdsGlobal.getLocale();

if (dataGrid) {
  (async function init() {
    // Set Locale and wait for it to load
    await locale?.setLocale('en-US');

    // Do an ajax request
    const url: any = booksJSON;
    const columns: IdsDataGridColumn[] = [];

    // Set up columns
    columns.push({
      id: 'rowNumber',
      name: '#',
      formatter: dataGrid.formatters.rowNumber,
      readonly: true,
      width: 65
    });
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      width: 180,
      editor: {
        type: 'input',
        editorSettings: {
          autoselect: true,
          dirtyTracker: true,
          validate: 'required'
        }
      },
      formatter: dataGrid.formatters.text,
      filterType: dataGrid.filters.text,
      resizable: true,
    });
    columns.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      formatter: dataGrid.formatters.text,
      resizable: true,
      hidden: true
    });
    columns.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      formatter: dataGrid.formatters.date,
      resizable: true,
    });
    columns.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      formatter: dataGrid.formatters.time,
      resizable: true,
    });
    columns.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      formatter: dataGrid.formatters.decimal,
      resizable: true,
      formatOptions: { locale: 'en-US' }
    });
    columns.push({
      id: 'bookCurrency',
      name: 'Currency',
      field: 'bookCurrency',
      formatter: dataGrid.formatters.text,
      resizable: true,
    });
    columns.push({
      id: 'transactionCurrency',
      name: 'Transaction Currency',
      field: 'transactionCurrency',
      formatter: dataGrid.formatters.text,
      resizable: true,
    });
    columns.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: dataGrid.formatters.integer,
      resizable: true,
      formatOptions: { locale: 'en-US' }
    });

    // Bind double click event
    dataGrid.addEventListener('dblclick', (e: Event) => {
      console.info(`Double Clicked`, (<CustomEvent>e).detail);
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.columnGroups = [
        {
          colspan: 2,
          id: 'group1',
          name: 'Column Group One',
          align: 'center'
        },
        {
          colspan: 2,
          id: 'group2',
          name: 'Column Group Two',
          headerIcon: 'error',
          headerIconTooltip: 'The group2 icon.',
        },
        {
          colspan: 2,
          id: 'group3',
          name: 'Column Group Three',
          align: 'right'
        },
        {
          colspan: 3,
          id: 'group4',
          name: 'Column Group Four',
          align: 'left'
        }
      ];
      dataGrid.data = data;
    };

    setData();
  }());
}
