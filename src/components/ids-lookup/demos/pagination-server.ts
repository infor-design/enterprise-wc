// Supporting components
import '../ids-lookup';

import booksJSON from '../../../assets/data/books.json';
import IdsGlobal from '../../ids-global/ids-global';

// Example for populating the DataGrid
const lookup: Element | any = document.querySelector('#lookup-1');

(async function init() {
  // Set a Locale and wait for it to load
  await IdsGlobal.getLocale().setLocale('en-US');

  // Do an ajax request
  const url: any = booksJSON;
  const columns = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: lookup.dataGrid.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: lookup.dataGrid.formatters.rowNumber,
    sortable: false,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    formatter: lookup.dataGrid.formatters.text
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    formatter: lookup.dataGrid.formatters.text
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    formatter: lookup.dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    formatter: lookup.dataGrid.formatters.text
  });

  lookup.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    lookup.dataGridSettings = {
      rowSelection: 'multiple',
      pageSize: 5,
      pageNumber: 1,
      pagination: 'server-side'
    };

    // Fake server side pagination
    const paginateData = (pageNumber = 1, pageSize = 10) => {
      const last = pageNumber * pageSize;
      const start = last - pageSize;
      lookup.dataGrid.data = data.slice(start, start + pageSize);
      lookup.dataGrid.pageTotal = data.length;
      lookup.dataGrid.pageNumber = pageNumber;
      lookup.dataGrid.pageSize = pageSize;
    };

    paginateData(1, lookup.dataGrid.pageSize);

    lookup.dataGrid.pager.addEventListener('pagenumberchange', async (e: CustomEvent) => {
      paginateData(e.detail.value, lookup.dataGrid.pageSize);
    });
  };

  setData();
}());
